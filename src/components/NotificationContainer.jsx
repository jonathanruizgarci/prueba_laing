import React from 'react';
import Notification from './Notification';
import { useNotification } from '../hooks/useNotification';

const NotificationContainer = () => {
  const { notifications, dismissToast } = useNotification();

  // 1. Filtrar solo las alertas que deben mostrarse (show_toast === true)
  const activeToasts = notifications.filter(n => n.show_toast === true);

  // 2. Eliminar duplicados visuales (por si el backend mandó dos veces el mismo ID rápido)
  const uniqueToasts = activeToasts.filter((notification, index, self) => 
    index === self.findIndex((t) => (
      t.custom_id === notification.custom_id
    ))
  );

  return (
    <div className="fixed top-20 right-5 z-[9999] w-full max-w-sm flex flex-col gap-2 pointer-events-none p-4">
      {uniqueToasts.map((notification) => (
        <div 
            // CORRECCIÓN KEY: Usamos custom_id que es único (ej: alert-temperature)
            key={notification.custom_id || notification.id} 
            className="pointer-events-auto"
        >
            <Notification
              notification={notification}
              // Pasamos una función anónima que ejecuta dismissToast con el ID correcto
              onRemove={() => dismissToast(notification.custom_id)} 
            />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;