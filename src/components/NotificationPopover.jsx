import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Bell, AlertTriangle, Check, Info } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

const icons = {
  error: <AlertTriangle size={20} className="text-red-500" />,
  warning: <AlertTriangle size={20} className="text-orange-500" />,
  info: <Info size={20} className="text-blue-500" />,
  success: <Check size={20} className="text-green-500" />,
};

const NotificationPopover = () => {
  const { notifications, deleteNotification } = useNotification();

  // Filtramos para mostrar solo las que no han sido resueltas (opcional)
  const pendingNotifications = notifications; 

  return (
    <Popover className="relative z-50"> 
      {({ open }) => (
        <>
          <Popover.Button 
            className={`relative rounded-full p-2.5 transition-all focus:outline-none ${
               open ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Bell size={24} />
            {pendingNotifications.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                {pendingNotifications.length}
              </span>
            )}
          </Popover.Button>
          
          {/* Panel Desplegable */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <Popover.Panel className="absolute right-0 mt-4 w-80 sm:w-96 transform px-0 z-50">
              <div className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 bg-white">
                
                {/* Cabecera */}
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-800">Notificaciones</h3>
                  <span className="text-xs font-medium text-gray-500">
                    {pendingNotifications.length} nuevas
                  </span>
                </div>

                {/* Lista */}
                <div className="max-h-[350px] overflow-y-auto">
                  {pendingNotifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {pendingNotifications.map((notification) => (
                        <div key={notification.custom_id || notification.id} className="p-4 hover:bg-gray-50 flex gap-3 group transition-colors">
                          <div className="mt-1 flex-shrink-0">
                             {icons[notification.type] || <Info size={20} className="text-gray-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-[10px] text-gray-400 mt-2 text-right">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          
                          {/* Botón Resolver */}
                          <button 
                            onClick={() => deleteNotification(notification.custom_id)}
                            className="self-start p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Marcar como resuelto"
                          >
                            <Check size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-sm">No hay notificaciones pendientes.</p>
                    </div>
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default NotificationPopover;