import React from 'react';
import { Server, Cpu, Activity, HardDrive } from 'lucide-react';

const SystemMetricBar = ({ label, value, percent, color, icon }) => {
    const Icon = icon;
    const colors = { 
        blue: "bg-blue-500 dark:bg-blue-600", 
        purple: "bg-purple-500 dark:bg-purple-600", 
        orange: "bg-orange-500 dark:bg-orange-600" 
    };
    
    return (
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center gap-2">
                <Icon size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full ${colors[color]} transition-all duration-1000 ease-out`} 
                style={{ width: `${percent}%` }}
              ></div>
          </div>
        </div>
    );
};

const SystemView = () => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Estado del Sistema</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">
                  <Server size={24} />
              </div>
              <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">RPI-FIELD-001</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Controlador Principal</p>
              </div>
          </div>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium self-start sm:self-center">
              ● Operativo
          </span>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-5">
              <SystemMetricBar label="Uso de CPU" value="51.8%" percent={51.8} color="blue" icon={Cpu} />
              <SystemMetricBar label="Uso de Memoria (RAM)" value="2.1GB / 4GB" percent={51.94} color="purple" icon={Activity} />
              <SystemMetricBar label="Almacenamiento" value="8GB / 32GB" percent={27.99} color="orange" icon={HardDrive} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemView;