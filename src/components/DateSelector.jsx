import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DateSelector = ({ selectedDate, setSelectedDate, mode = 'day' }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  const addTime = (amount) => {
    const result = new Date(selectedDate);
    if (mode === 'month') {
        result.setMonth(result.getMonth() + amount);
    } else {
        result.setDate(result.getDate() + amount);
    }
    setSelectedDate(result);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    // CAMBIO AQUÍ: Soporte para Dark Mode en el contenedor
    <div ref={calendarRef} className="flex items-center relative z-20 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-0.5">
      
      <button onClick={() => addTime(-1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-500 dark:text-gray-400 transition-colors">
        <ChevronLeft size={18} />
      </button>
      
      <div className="relative">
        <button 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors 
            ${isCalendarOpen 
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
        >
          <Calendar size={16} className={isCalendarOpen ? "text-blue-600 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"} />
          
          <span className="capitalize whitespace-nowrap">
            {mode === 'month' ? (
                <>
                    <span className="md:hidden">
                        {new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(selectedDate)}
                    </span>
                    <span className="hidden md:inline">
                        {new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(selectedDate)}
                    </span>
                </>
            ) : (
                new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(selectedDate)
            )}
          </span>
        </button>

        {isCalendarOpen && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 p-4 w-72 animate-in fade-in zoom-in duration-200">
              <div className="space-y-3">
               <label className="block text-xs text-gray-500 dark:text-gray-400 font-medium text-left">
                   {mode === 'month' ? "Seleccionar Mes:" : "Seleccionar Fecha:"}
               </label>
               <input 
                 type={mode === 'month' ? "month" : "date"} 
                 className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none text-gray-700 dark:text-white text-sm bg-gray-50 dark:bg-gray-900"
                 value={
                    mode === 'month'
                    ? selectedDate.toISOString().slice(0, 7)
                    : selectedDate.toISOString().split('T')[0]
                 }
                 onChange={(e) => {
                   if(e.target.value) {
                       const newDate = new Date(e.target.value + (mode === 'month' ? '-01T12:00:00' : 'T12:00:00'));
                       setSelectedDate(newDate);
                   }
                 }}
               />
               <button 
                 onClick={() => setIsCalendarOpen(false)}
                 className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
               >
                 Aplicar
               </button>
             </div>
          </div>
        )}
      </div>

      <button onClick={() => addTime(1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md text-gray-500 dark:text-gray-400 transition-colors">
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
export default DateSelector;