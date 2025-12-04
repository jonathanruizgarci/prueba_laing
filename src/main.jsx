import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext'; // <--- IMPORTAR

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> {/* <--- ENVOLVER AQUÍ */}
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  </StrictMode>,
);