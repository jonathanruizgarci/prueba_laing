import React, { useState } from 'react';
import { 
    ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
    AreaChart, Area, 
    BarChart, Bar, 
    LineChart, Line 
} from 'recharts';
import { Loader2, BarChart2, Activity, Layers } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext'; // Importar contexto para colores dinámicos en JS

// Botón pequeño para el selector (con soporte Dark Mode)
const ChartToggleButton = ({ active, onClick, icon: Icon, title }) => (
    <button
        onClick={onClick}
        title={title}
        className={`p-1.5 rounded-md transition-all duration-200 ${
            active 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800' 
            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
    >
        <Icon size={18} />
    </button>
);

const ChartCard = ({ title, data, dataKey, color = "#3b82f6", loading, noDataMessage, unit = "" }) => {
    const [chartType, setChartType] = useState('area');
    const { isDarkMode } = useTheme(); // Necesitamos esto para cambiar colores internos de Recharts

    // 1. Estado de carga
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full flex flex-col h-[400px]">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">{title}</h3>
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
            </div>
        );
    }

    // 2. Mensaje de "Sin Datos"
    if (noDataMessage || !data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full flex flex-col h-[400px]">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">{title}</h3>
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg text-gray-400 italic">
                    {noDataMessage || "No hay datos disponibles"}
                </div>
            </div>
        );
    }

    // 3. Renderizado de Gráficas
    const renderChart = () => {
        const commonProps = {
            data: data,
            margin: { top: 10, right: 10, left: -20, bottom: 0 }
        };

        const ChartComponent = {
            area: AreaChart,
            bar: BarChart,
            line: LineChart
        }[chartType];

        // Colores dinámicos para ejes y grid
        const axisColor = isDarkMode ? "#9ca3af" : "#6b7280";
        const gridColor = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
        const tooltipBg = isDarkMode ? "#1f2937" : "#fff";
        const tooltipBorder = isDarkMode ? "#374151" : "#e5e7eb";
        const tooltipText = isDarkMode ? "#f3f4f6" : "#111827";

        return (
            <ResponsiveContainer width="100%" height="100%">
                <ChartComponent {...commonProps}>
                    <defs>
                        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    
                    <XAxis 
                        dataKey="name" 
                        stroke={axisColor} 
                        tick={{ fontSize: 11, fill: axisColor }} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10} 
                        minTickGap={30} 
                    />
                    
                    <YAxis 
                        stroke={axisColor} 
                        tick={{ fontSize: 11, fill: axisColor }} 
                        tickLine={false} 
                        axisLine={false} 
                        width={40} 
                    />
                    
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: tooltipBg, 
                            borderColor: tooltipBorder, 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                        }}
                        labelStyle={{ color: axisColor, fontSize: '12px' }}
                        itemStyle={{ color: tooltipText }}
                        formatter={(value) => [`${value} ${unit}`, title]}
                    />
                    
                    {chartType === 'area' && (
                        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color${dataKey})`} />
                    )}
                    {chartType === 'bar' && (
                        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={30} />
                    )}
                    {chartType === 'line' && (
                        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                    )}
                </ChartComponent>
            </ResponsiveContainer>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-full h-[400px] flex flex-col hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
                
                {/* SELECTOR DE ESTILO */}
                <div className="flex bg-gray-50 dark:bg-gray-700/50 p-1 rounded-lg border border-gray-100 dark:border-gray-600 gap-1">
                    <ChartToggleButton active={chartType === 'area'} onClick={() => setChartType('area')} icon={Layers} title="Área" />
                    <ChartToggleButton active={chartType === 'bar'} onClick={() => setChartType('bar')} icon={BarChart2} title="Barras" />
                    <ChartToggleButton active={chartType === 'line'} onClick={() => setChartType('line')} icon={Activity} title="Línea" />
                </div>
            </div>
            
            <div className="flex-1 w-full min-w-0 min-h-0 relative">
                 {renderChart()}
            </div>
        </div>
    );
};

export default ChartCard;