import React, { useState, Fragment } from 'react';
import { BarChart2, HardDrive, Settings, Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Dialog, Transition } from '@headlessui/react';

// Vistas
import DashboardView from '../views/DashboardView';
import SensorsView from '../views/SensorsView';
import SystemView from '../views/SystemView';

// Componentes de Notificación
import NotificationContainer from './NotificationContainer';
import NotificationPopover from './NotificationPopover';

// --- IMPORTAR AMBOS LOGOS ---
// Asegúrate de tener 'logo_laing_dark.png' en tu carpeta de assets
import logoLight from '../assets/images/logo_laing.png';
import logoDark from '../assets/images/logo_laing_dark.png';

const LaingMonitoringSystem = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  
  // Obtenemos el estado del modo oscuro
  const { isDarkMode, toggleTheme } = useTheme();

  // Selector de Vistas
  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'sensors': return <SensorsView />;
      case 'system': return <SystemView />;
      default: return <DashboardView />;
    }
  };

  // Componente de Ítem de Navegación
  const NavItem = ({ view, icon: Icon, label, isMobile = false }) => (
    <li>
      <button 
        onClick={() => {
          setActiveView(view);
          if(isMobile) setSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${ 
            activeView === view 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        <Icon size={22} />
        <span className="font-semibold text-sm">{label}</span>
      </button>
    </li>
  );

  // Contenido del Sidebar
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 px-4">
        
        {/* --- AQUÍ ESTÁ LA MAGIA DEL LOGO --- */}
        <img 
          src={isDarkMode ? logoDark : logoLight} // Cambia según el modo
          alt="LAING" 
          className="h-10 object-contain" 
          // Si no encuentra el logo oscuro, muestra el texto como respaldo
          onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='block'}} 
        />
        <span className="hidden text-xl font-bold text-blue-900 dark:text-blue-400 tracking-wider">LAING-IO</span>
      
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-3 px-4">
          <NavItem view="dashboard" icon={BarChart2} label="Dashboard" isMobile={isMobile}/>
          <NavItem view="sensors" icon={HardDrive} label="Sensores" isMobile={isMobile}/>
          <NavItem view="system" icon={Settings} label="Sistema" isMobile={isMobile}/>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all">
          <LogOut size={22} />
          <span className="font-semibold text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`h-screen flex bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-300`}>
      
      <NotificationContainer />

      {/* --- Mobile Sidebar --- */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <div className="fixed inset-0 flex z-40">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full">
                <SidebarContent isMobile={true} />
              </Dialog.Panel>
            </Transition.Child>
            <div className="flex-shrink-0 w-14"></div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* --- Desktop Sidebar --- */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent />
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Móvil */}
        <header className="relative md:hidden flex items-center justify-between h-20 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <button type="button" className="p-2 text-gray-500 dark:text-gray-400" onClick={() => setSidebarOpen(true)}>
              <Menu size={28} />
            </button>
            {/* Logo en Header Móvil también */}
            <img src={isDarkMode ? logoDark : logoLight} alt="LAING" className="h-8 object-contain" />
            <div className="flex items-center gap-3">
                 <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400">
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                 </button>
                 <NotificationPopover />
            </div>
        </header>

        {/* Header Escritorio */}
        <header className="hidden md:flex items-center justify-end h-20 px-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center gap-6">
            
            <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Cambiar Tema"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <NotificationPopover />
            
            <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-600 mx-2"></div>
            
            <div className="flex items-center gap-3">
                <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Administrador</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ingeniero de Campo</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-blue-100 dark:ring-blue-900">
                    AD
                </div>
            </div>
          </div>
        </header>

        {/* Área Principal */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default LaingMonitoringSystem;