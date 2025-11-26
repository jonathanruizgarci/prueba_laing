// UBICACIÓN: src/components/ChartCard.jsx
import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label, unit, color }) => { 
    if (active && payload && payload.length) { 
        return (
            <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl min-w-[120px]">
                <p className="text-gray-800 font-bold mb-1 border-b border-gray-100 pb-1">{label}</p>
                <p className="text-sm font-medium" style={{ color: color }}>Valor: <span className="text-lg font-bold">{payload[0].value}</span> {unit}</p>
            </div>
        ); 
    } 
    return null; 
};

const ChartCard = ({ title, data, dataKey, color, unit }) => {
  const [chartType, setChartType] = useState('area'); 
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button onClick={() => setChartType('area')} className={`p-1.5 rounded-md transition-all ${chartType === 'area' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}><TrendingUp size={16} /></button>
          <button onClick={() => setChartType('bar')} className={`p-1.5 rounded-md transition-all ${chartType === 'bar' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}><BarChart2 size={16} /></button>
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} interval={1} tickMargin={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip unit={unit} color={color} />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '5 5' }} />
              <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fill={color} fillOpacity={0.2} activeDot={{ r: 6, strokeWidth: 0 }} />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} interval={1} tickMargin={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip unit={unit} color={color} />} cursor={{fill: 'transparent'}} />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;