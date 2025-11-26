import React from 'react';
import { Gauge, Droplet, Sun, AlertTriangle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ChartCard from '../components/ChartCard';
import DateSelector from '../components/DateSelector'; // <-- Importamos el widget

const DashboardView = ({ chartData, setTimeRange, timeRange, selectedDate, setSelectedDate }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* ENCABEZADO DASHBOARD CON WIDGET DE FECHA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard de Monitoreo</h1>
              <p className="text-gray-500 text-sm mt-1">Resumen de actividad</p>
            </div>
            
            {/* Aquí ponemos el widget restaurado */}
            <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>

        {/* Métricas Superiores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={Gauge} title="Sensores Activos" value="9/11" subtitle="Operativos" color="blue" />
            <MetricCard icon={Droplet} title="pH Promedio" value="7.1" subtitle="Estable" color="green" />
            <MetricCard icon={Sun} title="Radiación Max" value="950 W/m²" subtitle="13:00 PM" color="orange" />
            <MetricCard icon={AlertTriangle} title="Alertas" value="2" subtitle="Ver detalles" color="red" trend="-1" />
        </div>

        {/* Selector de Rango */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center border-b border-gray-200 pb-4 gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Análisis de Tendencias</h2>
            <div className="flex bg-gray-200 rounded-lg p-1">
                <button onClick={() => setTimeRange('daily')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${timeRange === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Diario</button>
                <button onClick={() => setTimeRange('monthly')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${timeRange === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Mensual</button>
            </div>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="pH - Acidez" data={chartData} dataKey="pH" color="#2563eb" unit="pH" />
            <ChartCard title="Humedad Relativa" data={chartData} dataKey="humedad" color="#06b6d4" unit="" />
            <ChartCard title="Temperatura" data={chartData} dataKey="temp" color="#ef4444" unit="°C" />
            <ChartCard title="Radiación Solar" data={chartData} dataKey="radiacion" color="#f59e0b" unit="W/m²" />
        </div>
    </div>
  );
};
export default DashboardView;