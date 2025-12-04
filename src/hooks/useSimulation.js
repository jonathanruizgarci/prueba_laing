import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNotification } from './useNotification';

export const useSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const { addNotification, deleteNotification } = useNotification();

  const toggleSimulation = () => setIsSimulating(!isSimulating);

  useEffect(() => {
    let intervalId;
    
    if (isSimulating) {
      const insertFakeData = async () => {
        try {
          // 1. Obtener sensor real
          const { data: sensors } = await supabase.from('sensors').select('id, serial_number').limit(1);
          
          if (!sensors || sensors.length === 0) {
            console.error("❌ No hay sensores.");
            setIsSimulating(false);
            return;
          }
          const sensor = sensors[0];

          // 2. Generar datos aleatorios (Lógica movida aquí)
          const fakeTemp = (Math.random() * (40 - 5) + 5).toFixed(1);
          const fakeHum = (Math.random() * (90 - 30) + 30).toFixed(1);
          const fakeSoil = (Math.random() * (95 - 15) + 15).toFixed(1);
          const fakePh = (Math.random() * (8.5 - 4.5) + 4.5).toFixed(2);
          const fakeRad = (Math.random() * 1300).toFixed(0);

          const payload = {
            sensor_id: sensor.id,
            sensor_serial_number: sensor.serial_number,
            timestamp: new Date().toISOString(),
            raspberry_pi_id: 'CLIENT-SIMULATOR',
            quality_score: 100,
            data: {
              temperature: parseFloat(fakeTemp),
              humidity: parseFloat(fakeHum),
              soil_humidity: parseFloat(fakeSoil),
              soil_moisture: parseFloat(fakeSoil),
              ph: parseFloat(fakePh),
              solar_radiation: parseFloat(fakeRad)
            }
          };

          // 3. Log en consola desde el Hook
          console.log("📤 [SIMULACIÓN] Enviando a BD:", payload.data);

          // 4. Insertar
          await supabase.from('sensor_readings').insert(payload);

        } catch (err) {
          console.error(err);
        }
      };

      insertFakeData();
      intervalId = setInterval(insertFakeData, 15000);
      
      addNotification({
        id: 'sim-active',
        type: 'info',
        title: 'Simulación Activa',
        message: 'Generando datos desde el Hook...'
      });

    } else {
        deleteNotification('sim-active');
    }

    return () => clearInterval(intervalId);
  }, [isSimulating, addNotification, deleteNotification]);

  return { isSimulating, toggleSimulation };
};