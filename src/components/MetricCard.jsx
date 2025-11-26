// UBICACIÓN: src/components/MetricCard.jsx
import React from 'react';

const MetricCard = ({ icon: Icon, title, value, subtitle, color, trend }) => {
  const styles = { 
    blue: "bg-blue-50 text-blue-600", 
    green: "bg-emerald-50 text-emerald-600", 
    orange: "bg-amber-50 text-amber-600", 
    red: "bg-rose-50 text-rose-600" 
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-lg ${styles[color] || styles.blue}`}>
            <Icon size={24} />
        </div>
        {trend && <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-700 rounded-full">{trend}</span>}
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default MetricCard;