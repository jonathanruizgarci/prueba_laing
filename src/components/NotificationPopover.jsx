// UBICACIÓN: src/components/NotificationPopover.jsx
import React from 'react';
import { AlertTriangle, X, Check, Info, User } from 'lucide-react';

const NotificationPopover = ({ notifications, markAllAsRead }) => {
  // Calculamos cuántas no leídas hay para el badge azul
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-14 right-4 md:right-8 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      
      {/* HEADER: Título y Badge Azul */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900">Notificaciones</h3>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount} nuevas
            </span>
          )}
        </div>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Ver todas</button>
      </div>

      {/* LISTA: Aquí está el SCROLL (max-h-400px y overflow-y-auto) */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length > 0 ? notifications.map(notif => (
          <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative ${!notif.read ? 'bg-blue-50/30' : ''}`}>
            <div className="flex gap-3">
              {/* ICONOS SEGÚN TIPO */}
              <div className="mt-1 flex-shrink-0">
                {notif.type === 'warning' && <div className="p-2 bg-orange-100 text-orange-600 rounded-full"><AlertTriangle size={16} /></div>}
                {notif.type === 'alert' && <div className="p-2 bg-red-100 text-red-600 rounded-full"><X size={16} /></div>}
                {notif.type === 'success' && <div className="p-2 bg-green-100 text-green-600 rounded-full"><Check size={16} /></div>}
                {notif.type === 'info' && <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Info size={16} /></div>}
                {notif.type === 'user' && <div className="p-2 bg-purple-100 text-purple-600 rounded-full"><User size={16} /></div>}
              </div>

              {/* CONTENIDO TEXTO */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</h4>
                  {/* Punto naranja de no leído */}
                  {!notif.read && <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></span>}
                </div>
                
                <p className="text-sm text-gray-600 leading-snug mb-2">{notif.message}</p>
                
                {/* BOTONES DE ACCIÓN (Si actionRequired es true) */}
                {notif.actionRequired && (
                  <div className="flex gap-2 mb-2 mt-2">
                    <button className="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded hover:bg-black transition-colors">
                        Aceptar
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors">
                        Rechazar
                    </button>
                  </div>
                )}
                
                <p className="text-xs text-gray-400">{notif.time}</p>
              </div>
            </div>
          </div>
        )) : <div className="p-8 text-center text-gray-500"><p>No tienes notificaciones nuevas</p></div>}
      </div>

      {/* FOOTER: Botón inferior */}
      <div className="p-2 bg-gray-50 text-center border-t border-gray-100">
        <button onClick={markAllAsRead} className="text-xs text-gray-500 hover:text-gray-900 font-medium">
            Marcar todo como leído
        </button>
      </div>
    </div>
  );
};

export default NotificationPopover;