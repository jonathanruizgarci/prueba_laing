import { useContext } from 'react';
// IMPORTANTE: Usamos llaves { } porque es un Named Export
import { NotificationContext } from '../contexts/NotificationContext';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
  }
  
  return context;
};