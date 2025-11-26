import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const DateSelector = ({ selectedDate, setSelectedDate }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  const formatDate = (date) => new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(date);
  const addDays = (days) => {
    const result = new Date(selectedDate);
    result.setDate(result.getDate() + days);
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
    <div ref={calendarRef} className="flex items-center self-end md:self-auto bg-white rounded-lg shadow-sm border border-gray-200 p-1 relative z-20">
      <button onClick={() => addDays(-1)} className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
        <ChevronLeft size={20} />
      </button>
      
      <div className="relative">
        <button 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={`flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-md transition-colors min-w-[140px] justify-center ${isCalendarOpen ? 'bg-blue-50 text-blue-600' : ''}`}
        >
          <Calendar size={18} className={isCalendarOpen ? "text-blue-600" : "text-gray-500"} />
          <span className="capitalize">{formatDate(selectedDate)}</span>
        </button>

        {isCalendarOpen && (
          <div className="absolute top-12 right-0 z-50 bg-white shadow-xl rounded-xl border border-gray-200 p-4 w-72 animate-in fade-in zoom-in duration-200 origin-top-right">
             <div className="space-y-3">
              <label className="block text-xs text-gray-500 font-medium text-left">Fecha (DD/MM/AAAA):</label>
              <input 
                type="date" 
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-gray-700 text-sm bg-gray-50"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  if(e.target.value) setSelectedDate(new Date(e.target.value + 'T12:00:00'));
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

      <button onClick={() => addDays(1)} className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default DateSelector;