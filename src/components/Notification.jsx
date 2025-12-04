import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const icons = {
  error: <AlertTriangle className="w-6 h-6 text-red-500" />,
  success: <CheckCircle className="w-6 h-6 text-green-500" />,
  info: <Info className="w-6 h-6 text-blue-500" />,
};

const Notification = ({ notification, onRemove }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleCloseClick = () => {
    setIsFadingOut(true);
    // Esperamos a que termine la animación (300ms) antes de llamar a onRemove
    setTimeout(() => {
        if (typeof onRemove === 'function') {
            onRemove();
        }
    }, 300);
  };

  // Auto-cierre opcional (si quisieras que se cierren solas después de 5 seg)
  /* useEffect(() => {
    const timer = setTimeout(() => {
       handleCloseClick();
    }, 5000);
    return () => clearTimeout(timer);
  }, []); 
  */

  return (
    <div
      className={`relative flex items-start gap-4 p-4 mb-3 overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 transform 
        ${isFadingOut ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'} 
        animate-in slide-in-from-right-full`}
    >
      <div className="flex-shrink-0 mt-1">
        {icons[notification.type] || icons.info}
      </div>
      
      <div className="flex-grow pr-6">
        <p className="font-semibold text-gray-800 text-sm">{notification.title}</p>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
        {notification.sensor && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] uppercase font-bold rounded">
                {notification.sensor}
            </span>
        )}
      </div>

      <button 
        onClick={handleCloseClick} 
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Notification;