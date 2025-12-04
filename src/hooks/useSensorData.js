import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNotification } from './useNotification';

// Configuración fuera del componente para que no se recree
const CROP_THRESHOLDS = {
  temperature: { min: 10, max: 35, label: "Temperatura", unit: "°C" },
  humidity: { min: 40, max: 80, label: "Humedad Aire", unit: "%" },
  soil_moisture: { min: 20, max: 90, label: "Humedad Suelo", unit: "%" },
  ph: { min: 5.5, max: 7.5, label: "pH", unit: "" },
  solar_radiation: { min: 100, max: 1200, label: "Radiación", unit: "W/m²" }
};

export const useSensorData = (timeRange, selectedDate) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const lastAnalyzedIdRef = useRef(null);
  const { addNotification, deleteNotification } = useNotification();

  // Lógica de Alertas
  const analyzeCropHealth = (latestReading) => {
    if (!latestReading || lastAnalyzedIdRef.current === latestReading.id) return;
    lastAnalyzedIdRef.current = latestReading.id;

    const diffInMinutes = (new Date() - new Date(latestReading.timestamp)) / 1000 / 60;
    if (diffInMinutes > 5) return;

    Object.keys(CROP_THRESHOLDS).forEach(key => {
        const value = latestReading[key];
        const config = CROP_THRESHOLDS[key];
        if (value != null) {
            const alertId = `alert-${key}`;
            if (value < config.min || value > config.max) {
                console.warn(`⚠️ ALERTA: ${config.label} (${value})`);
                addNotification({
                    id: alertId,
                    type: 'error',
                    title: `⚠️ Alerta de ${config.label}`,
                    message: `Lectura ACTUAL (${value.toFixed(1)}${config.unit}) fuera de rango.`,
                    sensor: key
                });
            } else {
                deleteNotification(alertId);
            }
        }
    });
  };

  const fetchData = useCallback(async () => {
    let from = new Date();
    let to = new Date();

    if (timeRange === 'custom') {
        from = new Date(selectedDate);
        from.setHours(0, 0, 0, 0);
        to = new Date(selectedDate);
        to.setHours(23, 59, 59, 999);
    } else {
        const hoursBack = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
        from = new Date();
        from.setHours(from.getHours() - hoursBack);
    }

    const { data: supabaseData, error } = await supabase
      .from('sensor_readings')
      .select('id, timestamp, data')
      .gte('timestamp', from.toISOString())
      .lte('timestamp', to.toISOString())
      .order('timestamp', { ascending: true });

    if (!error) {
      const formattedData = supabaseData.map(d => ({
          id: d.id,
          timestamp: d.timestamp,
          name: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          temperature: d.data.temperature,
          humidity: d.data.humidity,
          soil_moisture: d.data.soil_humidity || d.data.soil_moisture, // Soporte para ambos nombres
          solar_radiation: d.data.solar_radiation,
          ph: d.data.ph
      }));

      setData(formattedData);
      setLoading(false);

      // Analizar solo si estamos viendo datos recientes
      const isHistory = timeRange === 'custom' && selectedDate.toDateString() !== new Date().toDateString();
      if (formattedData.length > 0 && !isHistory) {
          analyzeCropHealth(formattedData[formattedData.length - 1]);
      }
    }
  }, [timeRange, selectedDate, addNotification, deleteNotification]);

  useEffect(() => {
    fetchData();
    const channel = supabase.channel('realtime-sensors')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_readings' }, () => {
          console.log("⚡ [HOOK] Dato nuevo detectado");
          fetchData();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  // Helper para obtener último valor
  const getLatestValid = (key) => {
      for (let i = data.length - 1; i >= 0; i--) {
          if (data[i][key] != null) return data[i][key];
      }
      return null;
  };

  return { data, loading, getLatestValid };
};