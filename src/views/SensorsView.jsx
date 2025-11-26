import React from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { sensorData } from '../data/mockData';

const SensorsView = () => {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Sensores</h1>
          <p className="text-gray-500 text-sm mt-1">Administra los dispositivos conectados</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Agregar Sensor
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Sensor</th>
                <th className="px-6 py-4 font-semibold">Ubicación</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold">Lectura</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sensorData.map((sensor) => (
                <tr key={sensor.id} className="bg-white hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{sensor.id}</td>
                  <td className="px-6 py-4">{sensor.ubicacion}</td>
                  <td className="px-6 py-4">{sensor.tipo}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{sensor.value}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${sensor.status === 'Activo' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                      {sensor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <button className="p-1.5 hover:bg-blue-100 text-blue-600 rounded"><Eye size={18} /></button>
                        <button className="p-1.5 hover:bg-gray-100 text-gray-600 rounded"><Edit size={18} /></button>
                        <button className="p-1.5 hover:bg-red-100 text-red-600 rounded"><Trash2 size={18} /></button>
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