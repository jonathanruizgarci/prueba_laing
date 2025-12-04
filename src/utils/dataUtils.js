/**
 * Procesa los datos crudos de los sensores.
 * @param {Array} rawData - Datos directos de Supabase.
 * @param {String} range - Rango seleccionado ('24h', '7d', 'custom', etc).
 * @param {Boolean} showDetail - ¿Mostrar minuto a minuto? (Nuevo)
 */
export const processDataByRange = (rawData, range, showDetail = false) => {
  // 1. Si no hay datos, devolver vacío
  if (!rawData || rawData.length === 0) return [];

  // =========================================================================
  // NUEVO: MODO DETALLADO (Minuto a Minuto)
  // Se activa con el nuevo botón. Muestra TODO sin filtrar.
  // =========================================================================
  if (showDetail) {
    return rawData.map(item => {
      const dateObj = new Date(item.timestamp);
      return {
        ...item,
        // Eje X: Hora y Minuto (ej: "14:05")
        name: dateObj.toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        })
      };
    });
  }

  // =========================================================================
  // LÓGICA ESTÁNDAR (Resumida para que la gráfica se vea limpia)
  // =========================================================================
  
  // MODO HORA POR HORA (24h o Día Específico)
  if (range === '24h' || range === 'custom') {
    const seenHours = new Set();
    const filtered = [];

    rawData.forEach(item => {
      const dateObj = new Date(item.timestamp);
      // Clave única por hora (Día_Hora)
      const hourKey = `${dateObj.getDate()}_${dateObj.getHours()}`;

      if (!seenHours.has(hourKey)) {
        seenHours.add(hourKey);
        filtered.push({
          ...item,
          // Eje X: Solo Hora (ej: "14:00")
          name: dateObj.toLocaleTimeString('es-MX', { 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false 
          })
        });
      }
    });

    // Siempre agregar el último dato real al final para ver el estado actual
    if (rawData.length > 0) {
        const lastItem = rawData[rawData.length - 1];
        if (filtered.length === 0 || filtered[filtered.length - 1].id !== lastItem.id) {
           const lastDateObj = new Date(lastItem.timestamp);
           filtered.push({
              ...lastItem,
              name: lastDateObj.toLocaleTimeString('es-MX', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  hour12: false 
              })
           });
        }
    }
    return filtered;
  }

  // MODO PROMEDIOS (7d, 30d, Mes)
  // Agrupa por día y saca promedios
  const grouped = rawData.reduce((acc, curr) => {
    const dateObj = new Date(curr.timestamp);
    const dayKey = dateObj.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });

    if (!acc[dayKey]) {
      acc[dayKey] = { 
        count: 0, 
        temps: 0, hums: 0, soils: 0, radiations: 0, phs: 0,
        originalTimestamp: curr.timestamp 
      };
    }
    if (curr.temperature != null) acc[dayKey].temps += Number(curr.temperature);
    if (curr.humidity != null) acc[dayKey].hums += Number(curr.humidity);
    if (curr.soil_moisture != null) acc[dayKey].soils += Number(curr.soil_moisture);
    if (curr.solar_radiation != null) acc[dayKey].radiations += Number(curr.solar_radiation);
    if (curr.ph != null) acc[dayKey].phs += Number(curr.ph);
    acc[dayKey].count++;
    return acc;
  }, {});

  return Object.keys(grouped).map(key => {
    const dayData = grouped[key];
    const n = dayData.count;
    return {
      id: key,
      name: key,
      timestamp: dayData.originalTimestamp,
      temperature: n ? parseFloat((dayData.temps / n).toFixed(1)) : null,
      humidity: n ? parseFloat((dayData.hums / n).toFixed(1)) : null,
      soil_moisture: n ? parseFloat((dayData.soils / n).toFixed(1)) : null,
      solar_radiation: n ? Math.round(dayData.radiations / n) : null,
      ph: n ? parseFloat((dayData.phs / n).toFixed(2)) : null,
    };
  }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};