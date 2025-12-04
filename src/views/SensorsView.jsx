import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

const SensorsView = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

  useEffect(() => {
    const fetchSensors = async () => {
      setLoading(true);
      
      const { data: sensors, error } = await supabase
        .from('sensors')
        .select(`
          id,
          serial_number,
          is_active,
          location:locations ( name ),
          type:sensor_types ( name ),
          sensor_readings ( data, timestamp ) 
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching sensors:', error);
        setSensorData([]);
      } else if (sensors) {
        const formattedData = sensors.map(sensor => {
          let latestValue = 'N/A';
          
          if (sensor.sensor_readings && sensor.sensor_readings.length > 0) {
            const readings = sensor.sensor_readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const reading = readings[0].data;

            const typeName = sensor.type ? sensor.type.name.toLowerCase() : '';
            
            if (reading) {
                if (typeName.includes('ph') && reading.ph) latestValue = `${reading.ph.toFixed(2)} pH`;
                else if (typeName.includes('temperatura') && reading.temperature) latestValue = `${reading.temperature.toFixed(1)} °C`;
                else if (typeName.includes('humedad') && reading.humidity) latestValue = `${reading.humidity.toFixed(1)} %`;
                else if (typeName.includes('radiación') && reading.solar_radiation) latestValue = `${reading.solar_radiation} W/m²`;
                else {
                    const firstKey = Object.keys(reading)[0];
                    if(firstKey && reading[firstKey]) latestValue = `${reading[firstKey]}`;
                }
            }
          }

          return {
            id: sensor.serial_number || sensor.id,
            ubicacion: sensor.location ? sensor.location.name : 'N/A',
            tipo: sensor.type ? sensor.type.name : 'N/A',
            value: latestValue,
            status: sensor.is_active ? 'Activo' : 'Inactivo',
          };
        });
        setSensorData(formattedData);
      }
      setLoading(false);
    };

    fetchSensors();
  }, []);

  const sortedAndFilteredData = React.useMemo(() => {
    let data = [...sensorData];
    if (searchTerm) {
      data = data.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [sensorData, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ tkey, label }) => {
    const isSorted = sortConfig.key === tkey;
    return (
      <th 
        scope="col" 
        className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors" 
        onClick={() => requestSort(tkey)}
      >
        <div className="flex items-center">
          {label}
          {isSorted ? (
            sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
          ) : <ChevronDown className="w-4 h-4 ml-1 opacity-25" />}
        </div>
      </th>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Sensores</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Administra tus dispositivos</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 flex items-center gap-2 shadow-sm transition-all">
                <Plus size={18} /> Agregar Sensor
            </button>
        </div>

        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-colors" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300 min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <SortableHeader tkey="id" label="ID / Serial" />
                            <SortableHeader tkey="ubicacion" label="Ubicación" />
                            <SortableHeader tkey="tipo" label="Tipo" />
                            <SortableHeader tkey="value" label="Última Lectura" />
                            <SortableHeader tkey="status" label="Estado" />
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-10 dark:text-gray-400">Cargando...</td></tr>
                        ) : sortedAndFilteredData.map((sensor) => (
                            <tr key={sensor.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-gray-900 dark:text-gray-100">{sensor.id}</td>
                                <td className="px-6 py-4">{sensor.ubicacion}</td>
                                <td className="px-6 py-4">{sensor.tipo}</td>
                                <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">{sensor.value}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${sensor.status === 'Activo' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {sensor.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"><Eye size={16}/></button>
                                        <button className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default SensorsView;