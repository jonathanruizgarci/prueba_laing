import React from 'react';

const MetricCard = ({ icon: Icon, title, value, subtitle, color, loading }) => {
    // Definimos colores para modo claro y modo oscuro (dark:...)
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
        green: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
        orange: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
        red: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
        purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse h-full">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center h-full hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center sm:items-start gap-2">
                
                {/* 1. TEXTOS */}
                <div className="min-w-0 flex-1">
                    {/* Título */}
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide truncate">
                        {title}
                    </p>
                    
                    {/* Valor */}
                    <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-0.5 sm:mt-1 truncate leading-tight">
                        {value}
                    </p>
                </div>

                {/* 2. ICONO */}
                <div className={`p-1.5 sm:p-2 rounded-lg ${colorClasses[color]} flex-shrink-0 transition-colors`}>
                    <Icon className="w-[18px] h-[18px] sm:w-6 sm:h-6" strokeWidth={2} />
                </div>
            </div>
            
            {/* Subtítulo (si existe) */}
            {subtitle && (
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-2 truncate">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default MetricCard;