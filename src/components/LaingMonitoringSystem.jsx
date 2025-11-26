// UBICACIÓN: src/components/LaingMonitoringSystem.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Bell, Home, Gauge, Activity, FileText, Map } from 'lucide-react';

// --- IMPORTACIONES DE VISTAS Y COMPONENTES ---
import DashboardView from '../views/DashboardView';
import SensorsView from '../views/SensorsView';
import SystemView from '../views/SystemView';
import NotificationPopover from './NotificationPopover';

// --- IMPORTACIÓN DE SERVICIOS (SUPABASE) ---
import { fetchSensorHistory } from '../services/api'; // <--- CONEXIÓN REAL

// --- IMPORTACIÓN DE ASSETS ---
import logoLaing from '../assets/images/logo_laing.png';

const LaingMonitoringSystem = () => {
  // --- ESTADOS DE NAVEGACIÓN Y UI ---
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- ESTADOS DEL DASHBOARD ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeRange, setTimeRange] = useState('daily');
  
  // AQUI EL CAMBIO IMPORTANTE: chartData empieza vacío y se llena con Supabase
  const [chartData, setChartData] = useState([]); 

  // --- ESTADOS DE NOTIFICACIONES ---
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const bellButtonRef = useRef(null);
  
  // Datos simulados de notificaciones (estos siguen siendo locales por ahora)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', title: 'pH Crítico', message: 'pH fuera de rango en Cama 003 (Valor: 8.1)', time: 'Hace 5 min', read: false, actionRequired: true },
    { id: 2, type: 'user', title: 'Solicitud de Acceso', message: 'Roberto Gómez solicita acceso al panel.', time: 'Hace 20 min', read: false, actionRequired: true },
    { id: 3, type: 'success', title: 'Calibración Exitosa', message: 'Sensor SOL0035L011 calibrado correctamente.', time: 'Hace 1 hora', read: false, actionRequired: false },
    { id: 4, type: 'info', title: 'Reporte Diario', message: 'El reporte de ayer ya está disponible.', time: 'Hace 3 horas', read: true, actionRequired: false },
    { id: 5, type: 'alert', title: 'Sensor Desconectado', message: 'Sensor SOM045L004 sin respuesta.', time: 'Ayer', read: true, actionRequired: false },
    // Notificaciones extra para probar el scroll
    { id: 6, type: 'info', title: 'Backup Realizado', message: 'Copia de seguridad completada.', time: 'Ayer', read: true },
    { id: 7, type: 'warning', title: 'Humedad Baja', message: 'Sector B por debajo del 40%.', time: 'Hace 2 días', read: true },
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // --- EFECTO 1: CARGAR DATOS DE SUPABASE ---
  useEffect(() => {
    const loadData = async () => {
      console.log("Cargando datos de Supabase...");
      const data = await fetchSensorHistory();
      
      if (data.length > 0) {
        setChartData(data);
      } else {
        console.log("No se recibieron datos o hubo error.");
      }
    };

    loadData();

    // Opcional: Recargar cada 60 segundos para ver cambios si conectas sensores reales
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [selectedDate, timeRange]); // Se recarga si cambias la fecha (lógica futura)


  // --- EFECTO 2: CERRAR NOTIFICACIONES AL HACER CLIC FUERA ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target) &&
        bellButtonRef.current && 
        !bellButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // --- RENDERIZADO PRINCIPAL ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* HEADER SUPERIOR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm relative">
        <div className="flex items-center gap-4">
          {/* Botón menú móvil */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* LOGO IMPORTADO */}
          <img 
            src={logoLaing} 
            alt="Laing Logo" 
            className="h-8 w-auto" 
            onError={(e) => e.target.src = 'https://via.placeholder.com/150'} 
          />
        </div>
        
        <div className="flex items-center gap-3">
            {/* BOTÓN DE NOTIFICACIONES */}
            <button 
                ref={bellButtonRef}
                onClick={() => setShowNotifications(!showNotifications)} 
                className={`p-2 rounded-full relative transition-colors ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">{unreadCount}</span>}
            </button>
            
            {/* COMPONENTE DE NOTIFICACIONES (POPOVER) */}
            {showNotifications && (
                <div ref={notificationRef}>
                    <NotificationPopover 
                        notifications={notifications} 
                        markAllAsRead={() => setNotifications(notifications.map(n => ({...n, read: true})))} 
                    />
                </div>
            )}
            
            {/* AVATAR DE USUARIO */}
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:shadow-md transition-shadow">JP</div>
        </div>
      </header>

      {/* LAYOUT PRINCIPAL (SIDEBAR + CONTENIDO) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR DE NAVEGACIÓN */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-200 ease-in-out flex flex-col pt-16 lg:pt-0`}>
          <nav className="p-4 space-y-1 flex-1">
            {[
                { id: 'dashboard', icon: Home, label: 'Dashboard' }, 
                { id: 'sensors', icon: Gauge, label: 'Sensores' }, 
                { id: 'system', icon: Activity, label: 'Sistema' },
                { id: 'reports', icon: FileText, label: 'Reportes' },
                { id: 'map', icon: Map, label: 'Mapa' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => { setCurrentScreen(item.id); setMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentScreen === item.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <item.icon size={20} />{item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* VISTA DASHBOARD (Con datos de Supabase) */}
          {currentScreen === 'dashboard' && (
            <DashboardView 
                chartData={chartData} 
                timeRange={timeRange} 
                setTimeRange={setTimeRange}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
          )}
          
          {/* VISTA DE SENSORES */}
          {currentScreen === 'sensors' && <SensorsView />}
          
          {/* VISTA DE SISTEMA */}
          {currentScreen === 'system' && <SystemView />}
          
          {/* VISTAS EN CONSTRUCCIÓN */}
          {(currentScreen !== 'dashboard' && currentScreen !== 'sensors' && currentScreen !== 'system') && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FileText size={48} className="mb-4 opacity-50"/>
                <p className="text-lg font-medium">Sección en construcción</p>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LaingMonitoringSystem;