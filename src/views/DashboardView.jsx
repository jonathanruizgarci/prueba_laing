import React, { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Thermometer, Droplets, Wind, Sun, Activity, 
  Play, Square, BarChart2 
} from 'lucide-react';

// Componentes
import ChartCard from '../components/ChartCard';
import DateSelector from '../components/DateSelector';
import MetricCard from '../components/MetricCard';
import TimeRangeSelector from '../components/TimeRangeSelector';

// Hooks y Utils
import { useNotification } from '../hooks/useNotification';
import { processDataByRange } from '../utils/dataUtils'; 

// Configuración de Umbrales
const CROP_THRESHOLDS = {
  temperature: { min: 10, max: 35, label: "Temperatura", unit: "°C" },
  humidity: { min: 40, max: 80, label: "Humedad Aire", unit: "%" },
  soil_moisture: { min: 20, max: 90, label: "Humedad Suelo", unit: "%" },
  ph: { min: 5.5, max: 7.5, label: "pH", unit: "" },
  solar_radiation: { min: 100, max: 1200, label: "Radiación", unit: "W/m²" }
};

const DashboardView = () => {
  const [data, setData] = useState([]);
  const [timeRange, setTimeRange] = useState('custom'); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  
  // Estado para alternar entre vista resumida (hora) y detallada (minuto)
  const [showDetail, setShowDetail] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const lastAnalyzedIdRef = useRef(null);
  const { addNotification, deleteNotification } = useNotification();

  // --- MANEJADORES ---
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (timeRange !== 'month') setTimeRange('custom'); 
  };

  const handleTimeRangeSelect = (range) => {
    setTimeRange(range);
    if (range !== 'month' && range !== 'custom') setSelectedDate(new Date());
  };

  const toggleSimulation = () => setIsSimulating(!isSimulating);

  // --- SIMULACIÓN ---
  useEffect(() => {
    let intervalId;
    if (isSimulating) {
      const insertFakeData = async () => {
        try {
          const { data: sensors } = await supabase.from('sensors').select('id, serial_number').limit(1);
          if (!sensors || sensors.length === 0) { setIsSimulating(false); return; }
          const sensor = sensors[0];

          const payload = {
            sensor_id: sensor.id,
            sensor_serial_number: sensor.serial_number,
            timestamp: new Date().toISOString(),
            raspberry_pi_id: 'CLIENT-SIMULATOR',
            quality_score: 100,
            data: {
              temperature: parseFloat((Math.random() * (40 - 5) + 5).toFixed(1)),
              humidity: parseFloat((Math.random() * (90 - 30) + 30).toFixed(1)),
              soil_humidity: parseFloat((Math.random() * (95 - 15) + 15).toFixed(1)),
              soil_moisture: parseFloat((Math.random() * (95 - 15) + 15).toFixed(1)),
              ph: parseFloat((Math.random() * (8.5 - 4.5) + 4.5).toFixed(2)),
              solar_radiation: parseFloat((Math.random() * 1300).toFixed(0))
            }
          };

          const { error } = await supabase.from('sensor_readings').insert(payload);
          if (error) console.error("❌ Error insertando:", error.message);

        } catch (err) { console.error(err); }
      };

      insertFakeData();
      // Intervalo de 15 segundos para la demo (puedes cambiarlo a 60000 para 1 min)
      intervalId = setInterval(insertFakeData, 15000); 
      addNotification({ id: 'sim-start', type: 'info', title: 'Simulación Activa', message: 'Insertando datos...' });
    } else {
        deleteNotification('sim-start');
    }
    return () => clearInterval(intervalId);
  }, [isSimulating, addNotification, deleteNotification]); 

  // --- ANÁLISIS DE ALERTAS ---
  const analyzeCropHealth = (latestReading) => {
    if (!latestReading) return;
    if (lastAnalyzedIdRef.current === latestReading.id) return;
    lastAnalyzedIdRef.current = latestReading.id;

    const diffInMinutes = (new Date() - new Date(latestReading.timestamp)) / 1000 / 60;
    if (diffInMinutes > 5) return; 

    Object.keys(CROP_THRESHOLDS).forEach(key => {
        const value = latestReading[key];
        const config = CROP_THRESHOLDS[key];
        if (value != null) {
            const alertId = `alert-${key}`;
            if (value < config.min || value > config.max) {
                addNotification({
                    id: alertId, type: 'error', title: `⚠️ Alerta de ${config.label}`,
                    message: `Lectura ACTUAL (${Number(value).toFixed(1)}${config.unit}) fuera de rango.`, sensor: key
                });
            } else { deleteNotification(alertId); }
        }
    });
  };

  // --- FETCH DATA ---
  const fetchData = useCallback(async () => {
    let from = new Date();
    let to = new Date();

    if (timeRange === 'custom') {
        from = new Date(selectedDate); from.setHours(0, 0, 0, 0);
        to = new Date(selectedDate); to.setHours(23, 59, 59, 999);
    } else if (timeRange === 'month') {
        from = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        to = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        to.setHours(23, 59, 59, 999);
    } else {
        const hoursBack = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        from = new Date(); from.setHours(from.getHours() - hoursBack);
    }

    const { data: supabaseData, error } = await supabase
      .from('sensor_readings')
      .select('id, timestamp, data')
      .gte('timestamp', from.toISOString())
      .lte('timestamp', to.toISOString())
      .order('timestamp', { ascending: true });

    if (!error) {
      const rawData = supabaseData.map(d => {
        const sensorJson = d.data || {};
        return {
          id: d.id, timestamp: d.timestamp,
          temperature: sensorJson.temperature ?? sensorJson.soil_temperature,
          humidity: sensorJson.humidity,
          soil_moisture: sensorJson.soil_humidity ?? sensorJson.soil_moisture,
          solar_radiation: sensorJson.solar_radiation,
          ph: sensorJson.ph
        };
      });

      // Procesar datos (Resumidos o Detallados según showDetail)
      const chartReadyData = processDataByRange(rawData, timeRange, showDetail);
      setData(chartReadyData);
      setLoading(false);

      const isHistory = (timeRange === 'custom' || timeRange === 'month') && selectedDate.toDateString() !== new Date().toDateString();
      if (rawData.length > 0 && !isHistory) {
          analyzeCropHealth(rawData[rawData.length - 1]);
      }
    }
  }, [timeRange, selectedDate, showDetail, addNotification, deleteNotification]);

  // --- REALTIME SUBSCRIPTION ---
  useEffect(() => {
    fetchData();
    const isLive = timeRange === '24h' || (timeRange === 'custom' && selectedDate.toDateString() === new Date().toDateString());
    let channel;
    if (isLive) {
        channel = supabase.channel('realtime-sensors')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_readings' }, () => fetchData())
          .subscribe();
    }
    return () => { if(channel) supabase.removeChannel(channel); };
  }, [fetchData, timeRange, selectedDate]);

  const getLatestValid = (key) => {
      for (let i = data.length - 1; i >= 0; i--) { if (data[i][key] != null) return data[i][key]; }
      return null;
  };

  const SingleMetricChart = ({ title, dataKey, color, unit }) => {
    const cleanData = data.filter(d => d[dataKey] !== null);
    return (
      <ChartCard title={title} data={cleanData} dataKey={dataKey} color={color} unit={unit} loading={loading} noDataMessage={cleanData.length === 0 ? `Esperando datos...` : null} />
    );
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-[100vw] overflow-x-hidden">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative z-30">
            
            {/* IZQUIERDA: Texto y Botones de Acción */}
            <div className="flex items-center gap-4">
                
                {/* Textos */}
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Monitor Ambiental</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {timeRange === 'month' 
                            ? `Resumen de ${selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
                            : timeRange === 'custom' 
                                ? `Datos del ${selectedDate.toLocaleDateString()}` 
                                : `Tendencia de las últimas ${timeRange}`}
                    </p>
                </div>
                
                {/* Grupo de Acciones */}
                <div className="flex items-center gap-2">
                    
                    {/* Botón Simulación (Verde/Rojo con soporte Dark Mode) */}
                    <button
                        onClick={toggleSimulation}
                        title={isSimulating ? "Detener Simulación" : "Iniciar Testeo"}
                        className={`flex items-center gap-2 rounded-lg transition-all shadow-sm font-bold text-xs sm:text-sm ${
                            isSimulating 
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 p-1.5 sm:px-3 sm:py-1.5 animate-pulse' 
                            : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 p-1.5 sm:px-3 sm:py-1.5'
                        }`}
                    >
                        {isSimulating ? <Square size={18} /> : <Play size={18} />}
                        <span className="hidden sm:inline">
                            {isSimulating ? "Detener" : "Test en Vivo"}
                        </span>
                    </button>

                    {/* Botón Vista Detallada (Azul/Gris con soporte Dark Mode) */}
                    <button
                        onClick={() => setShowDetail(!showDetail)}
                        title={showDetail ? "Ver Resumen" : "Ver Minuto a Minuto"}
                        className={`p-1.5 sm:p-2 rounded-lg transition-all shadow-sm border ${
                            showDetail 
                            ? 'bg-blue-100 text-blue-600 border-blue-200 ring-1 ring-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700' 
                            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                        }`}
                    >
                        <BarChart2 size={20} />
                    </button>
                </div>
            </div>
            
            {/* DERECHA: Filtros de Navegación */}
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                
                {/* Grupo: Día/Mes + Calendario */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-600 rounded-lg p-0.5 bg-white dark:bg-gray-700 shadow-sm">
                        <button onClick={() => setTimeRange('custom')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === 'custom' || timeRange === '24h' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>Día</button>
                        <div className="w-[1px] h-3 bg-gray-200 dark:bg-gray-600"></div>
                        <button onClick={() => setTimeRange('month')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${timeRange === 'month' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'}`}>Mes</button>
                    </div>
                    
                    {/* Selector de Fecha */}
                    {(timeRange === 'custom' || timeRange === 'month') && (
                        <DateSelector selectedDate={selectedDate} setSelectedDate={handleDateSelect} mode={timeRange === 'month' ? 'month' : 'day'} />
                    )}
                </div>

                <div className="hidden xl:block h-6 w-[1px] bg-gray-200 dark:bg-gray-700"></div>

                {/* Filtros Rápidos (Historial) */}
                <TimeRangeSelector selected={timeRange} onSelect={handleTimeRangeSelect} />
            </div>
        </div>

        {/* --- MÉTRICAS (2 Cols en Móvil, 5 en PC) --- */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-3 md:gap-6 relative z-0">
            <MetricCard title="Temperatura" value={getLatestValid('temperature') ? `${Number(getLatestValid('temperature')).toFixed(1)}°C` : '--'} icon={Thermometer} color="red" loading={loading} />
            <MetricCard title="Humedad Aire" value={getLatestValid('humidity') ? `${Number(getLatestValid('humidity')).toFixed(1)}%` : '--'} icon={Droplets} color="blue" loading={loading} />
            <MetricCard title="Humedad Suelo" value={getLatestValid('soil_moisture') ? `${Number(getLatestValid('soil_moisture')).toFixed(1)}%` : '--'} icon={Wind} color="green" loading={loading} />
            <MetricCard title="Radiación Solar" value={getLatestValid('solar_radiation') ? `${Number(getLatestValid('solar_radiation'))}` : '--'} icon={Sun} color="orange" loading={loading} />
            <MetricCard title="pH" value={getLatestValid('ph') ? `${Number(getLatestValid('ph')).toFixed(2)}` : '--'} icon={Activity} color="purple" loading={loading} />
        </div>

        {/* --- GRÁFICAS --- */}
        <div className="flex flex-col gap-8 w-full relative z-0">
            <SingleMetricChart title="Temperatura Ambiente" dataKey="temperature" color="#ef4444" unit="°C" />
            <SingleMetricChart title="Humedad Relativa" dataKey="humidity" color="#3b82f6" unit="%" />
            <SingleMetricChart title="Humedad del Suelo" dataKey="soil_moisture" color="#10b981" unit="%" />
            <SingleMetricChart title="Radiación Solar" dataKey="solar_radiation" color="#f59e0b" unit=" W/m²" />
            <SingleMetricChart title="Nivel de pH" dataKey="ph" color="#8b5cf6" unit=" pH" />
        </div>
    </div>
  );
};

export default DashboardView;