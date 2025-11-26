// UBICACIÓN: src/data/mockData.js

export const generateHourlyData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      let radiacion = 0;
      if (i >= 6 && i <= 19) { 
         const solPeak = 950; 
         const normalizedTime = (i - 6) / 13; 
         radiacion = Math.floor(solPeak * Math.sin(normalizedTime * Math.PI) + (Math.random() * 30));
      }
      const tempBase = 18; 
      const tempVariacion = 10;
      const temp = Number((tempBase + tempVariacion * Math.sin(((i - 9) / 24) * 2 * Math.PI) + Math.random() * 0.4).toFixed(1));
      const humedad = Math.floor(85 - ((temp - 10) * 2.2) + Math.random() * 2);
      const pH = Number((6.8 + Math.random() * 0.3 - 0.15).toFixed(2));
  
      data.push({ name: hour, pH, radiacion: radiacion < 0 ? 0 : radiacion, humedad: humedad > 100 ? 100 : humedad, temp });
    }
    return data;
  };
  
  export const sensorData = [
    { id: 'SOL0035L011', modbus: 11, ubicacion: 'Invernadero A - Sector 1', tipo: 'Radiación', status: 'Activo', value: '850 W/m²' },
    { id: 'SOL0025L010', modbus: 10, ubicacion: 'Área 2 - Parcela Norte', tipo: 'Radiación', status: 'Activo', value: '820 W/m²' },
    { id: 'SOM065L006', modbus: 6, ubicacion: 'Cama 007 - Cultivo Hidropónico', tipo: 'Multi-parámetro', status: 'Activo', value: 'pH 7.2' },
    { id: 'TEM0012L001', modbus: 2, ubicacion: 'Invernadero B - Entrada', tipo: 'Temperatura', status: 'Inactivo', value: '--' },
    { id: 'HUM0044L008', modbus: 8, ubicacion: 'Área 1 - Germinación', tipo: 'Humedad', status: 'Activo', value: '65' },
  ];