import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

// 1. EXPORTACIÓN NOMBRADA DEL CONTEXTO
export const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  dismissToast: () => {},
  deleteNotification: () => {},
});

// 2. EXPORTACIÓN NOMBRADA DEL PROVIDER
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Cargar notificaciones de Supabase
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando notificaciones:', error);
    } else {
      setNotifications(data || []);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, fetchNotifications)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addNotification = useCallback(async (notification) => {
    const newAlert = {
      custom_id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      sensor: notification.sensor || null,
      show_toast: true,
      created_at: new Date().toISOString()
    };

    // Actualización optimista
    setNotifications(prev => {
      const exists = prev.find(n => n.custom_id === newAlert.custom_id);
      if (exists) return prev.map(n => n.custom_id === newAlert.custom_id ? { ...exists, ...newAlert } : n);
      return [newAlert, ...prev];
    });

    const { error } = await supabase
      .from('notifications')
      .upsert(newAlert, { onConflict: 'custom_id' });

    if (error) console.error('Error guardando alerta:', error);
  }, []);

  const dismissToast = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.custom_id === id ? { ...n, show_toast: false } : n));
    
    await supabase
      .from('notifications')
      .update({ show_toast: false })
      .eq('custom_id', id);
  }, []);

  const deleteNotification = useCallback(async (id) => {
    setNotifications(prev => prev.filter(n => n.custom_id !== id));

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('custom_id', id);

    if (error) console.error('Error borrando notificación:', error);
  }, []);

  const value = { notifications, addNotification, dismissToast, deleteNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};