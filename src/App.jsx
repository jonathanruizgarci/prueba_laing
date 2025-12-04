import React from 'react';
import LaingMonitoringSystem from './components/Header';

// Este archivo debe estar LIMPIO, solo renderiza el componente principal.
// Toda la lógica de datos ahora vive en DashboardView.jsx
function App() {
  return (
    <div className="App">
       <LaingMonitoringSystem />
    </div>
  );
}

export default App;