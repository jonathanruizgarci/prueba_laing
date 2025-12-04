import React from 'react';

const options = [
  { id: '24h', label: '24h' },
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
];

const TimeRangeSelector = ({ selected, onSelect }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Etiqueta "HISTORIAL:" ahora es blanca en modo oscuro (dark:text-white) */}
      <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider hidden xl:block">
        Historial:
      </span>
      
      {/* Contenedor de botones oscuro en dark mode (dark:bg-gray-700) */}
      <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1 border border-gray-100 dark:border-gray-600">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
              selected === option.id
                // Estilo Activo: Azul en light, Azul fuerte + texto blanco en dark
                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200 dark:bg-blue-600 dark:text-white dark:ring-0'
                // Estilo Inactivo: Gris claro en light, Gris medio en dark
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeRangeSelector;
