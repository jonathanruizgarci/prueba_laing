// UBICACIÓN: src/services/api.js
import { supabase } from '../supabaseClient';

export const fetchSensorHistory = async () => {
  try {
    // 1. Pedimos las lecturas de las últimas 24 horas
    const { data, error } = await supabase
      .from('lecturas')
      .select('*')
      .order('created_at', { ascending: true }); // Ordenado por fecha

    if (error) throw error;

    // 2. TRANSFORMACIÓN DE DATOS (De SQL a Gráfica)
    // El objetivo es agrupar por hora. Ej: "10:00" -> { pH: 7, temp: 24... }
    
    const groupedData = {};

    data.forEach(lectura => {
      // Convertimos la fecha UTC a hora local legible (Ej: "14:00")
      const dateObj = new Date(lectura.created_at);
      const hourKey = dateObj.getHours().toString().padStart(2, '0') + ':00';

      // Si esa hora no existe en nuestro objeto temporal, la creamos
      if (!groupedData[hourKey]) {
        groupedData[hourKey] = { name: hourKey };
      }

      // Mapeamos los tipos de la BD a las llaves que usan tus gráficas
      if (lectura.tipo === 'Temperatura') groupedData[hourKey].temp = lectura.valor;
      if (lectura.tipo === 'Humedad') groupedData[hourKey].humedad = lectura.valor;
      if (lectura.tipo === 'Radiacion') groupedData[hourKey].radiacion = lectura.valor;
      if (lectura.tipo === 'pH') groupedData[hourKey].pH = lectura.valor;
    });

    // Convertimos el objeto agrupado en un array para Recharts
    return Object.values(groupedData);

  } catch (error) {
    console.error("Error conectando a Supabase:", error);
    return []; // Retornamos array vacío si falla para que no rompa la app
  }
};