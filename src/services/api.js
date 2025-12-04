import { supabase } from '../supabaseClient';

// ==========================================
// 1. FUNCIONES PARA OBTENER DATOS (GRÁFICAS)
// ==========================================

export const getReadingsByTime = async (hours = 34) => {
  const startTime = new Date();
  startTime.setHours(startTime.getHours() - hours);

  const { data, error } = await supabase
    .from('sensor_readings')
    .select('timestamp, data')
    .gte('timestamp', startTime.toISOString())
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error al obtener lecturas para gráficas:', error);
    return [];
  }
  return data;
};

// ==========================================
// 2. FUNCIONES INTERNAS (ALERTAS)
// ==========================================

// Esta es la función que te faltaba y causaba el error
async function getAlertsConfig() {
  const { data, error } = await supabase
    .from('alerts_config')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching alerts config:', error);
    return [];
  }
  return data;
}

async function getLatestSensorReadings() {
  const { data, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching latest sensor readings:', error);
    return null;
  }
  return data;
}

// ==========================================
// 3. LÓGICA PRINCIPAL DE ALERTAS (EXPORTADA)
// ==========================================

export async function checkSensorReadings() {
  // Ahora sí encontrará estas funciones porque están definidas arriba
  const alertsConfigs = await getAlertsConfig();
  const latestReading = await getLatestSensorReadings();

  if (!latestReading || !alertsConfigs || alertsConfigs.length === 0) {
    return [];
  }

  const newNotifications = [];
  const readingData = latestReading.data || {};

  for (const config of alertsConfigs) {
    // Mapeo correcto de columnas de tu base de datos
    const metric = config.parameter;        
    const min_value = config.threshold_min; 
    const max_value = config.threshold_max; 
    
    // Buscamos el valor en el JSON usando la métrica configurada
    const value = readingData[metric]; 

    // Solo evaluamos si el valor existe en esta lectura
    if (value !== null && value !== undefined) {
      let isOutOfRange = false;
      let message = '';

      // Verificamos mínimos
      if (min_value !== null && value < min_value) {
        isOutOfRange = true;
        message = `¡Alerta! ${metric} (${value}) está bajo el mínimo (${min_value}).`;
      } 
      // Verificamos máximos
      else if (max_value !== null && value > max_value) {
        isOutOfRange = true;
        message = `¡Alerta! ${metric} (${value}) superó el máximo (${max_value}).`;
      }

      if (isOutOfRange) {
        newNotifications.push({
          id: `${latestReading.id}-${metric}`, 
          type: 'error',
          title: `Alerta: ${metric}`,
          message: message,
        });
      }
    }
  }

  return newNotifications;
}