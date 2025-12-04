# Blueprint de la Aplicación de Monitoreo de Agua

## Resumen del Proyecto

Esta aplicación es un dashboard de monitoreo en tiempo real, diseñado para visualizar datos de sensores de calidad de agua. Está construida con React y conectada a una base de datos Supabase. La interfaz muestra métricas clave, gráficos de tendencias y una tabla para la gestión de los sensores.

## Estructura y Estilo

- **Framework**: React (Vite)
- **Estilos**: Tailwind CSS para un diseño moderno y responsivo.
- **Componentes**: La UI se divide en componentes reutilizables como tarjetas de métricas (`MetricCard`), gráficos (`ChartCard`) y selectores de fecha (`DateSelector`).
- **Iconografía**: Se utiliza la librería `lucide-react` para iconos limpios y consistentes.

## Características Implementadas

### 1. Dashboard Principal (`DashboardView.jsx`)
- **Visualización de Métricas Clave**: Muestra tarjetas con datos importantes como el número de sensores activos, el pH actual, la radiación solar y el conteo de alertas. Los datos se obtienen en tiempo real desde Supabase.
- **Gráficos de Tendencias**: Presenta gráficos de líneas para analizar la evolución de pH, humedad, temperatura y radiación. Los datos se cargan desde la tabla `data` de Supabase.
- **Selector de Rango de Tiempo**: Permite al usuario filtrar los datos de los gráficos por día o por mes.
- **Selector de Fecha**: Un widget de calendario para elegir la fecha a analizar.
- **Carga Asíncrona**: Muestra esqueletos de carga (`loading skeletons`) mientras se obtienen los datos, mejorando la experiencia de usuario.
- **Generación de Datos de Prueba**: Se ha añadido un botón que, al ser presionado, invoca la función `generar_datos_prueba_suelo` en la base de datos para poblarla con datos de prueba. Tras la generación, el dashboard se actualiza automáticamente.

### 2. Gestión de Sensores (`SensorsView.jsx`)
- **Tabla de Sensores**: Muestra una lista de todos los sensores registrados, obteniendo los datos de la tabla `sensors` en Supabase.
- **Datos Relevantes**: La tabla incluye el ID del sensor, su ubicación (obtenida de la tabla `locations`), el tipo (de `sensor_types`) y su estado (activo/inactivo).
- **Última Lectura**: La tabla ahora muestra la lectura más reciente de cada sensor, consultando la tabla `data`.
- **Acciones Rápidas**: Botones para ver, editar y eliminar cada sensor (funcionalidad futura).

### 3. Conexión a Base de Datos (`supabaseClient.js`, `.env`)
- **Cliente Supabase**: Se configuró un cliente centralizado para interactuar con la base de datos.
- **Variables de Entorno**: Las credenciales de Supabase se almacenan de forma segura en un archivo `.env`.

### 4. Servicio de API (`src/services/api.js`)
- **Lógica Centralizada**: Se ha creado un servicio para centralizar las llamadas a la base de datos, pero actualmente los componentes realizan las llamadas directamente.

## Plan para la Solicitud Actual

**Objetivo**: Añadir un botón para generar datos de prueba en la base de datos.

**Pasos Ejecutados**:

1.  **Añadir Botón en UI**: Se agregó un botón "Generar Datos" en `DashboardView.jsx` con un ícono y un estado de carga.
2.  **Implementar Lógica de Llamada**: Se creó la función `handleGenerateData` que utiliza `supabase.rpc()` para invocar la función de base de datos `generar_datos_prueba_suelo`.
3.  **Manejo de Estado y Feedback**: Se añadió un estado `isGenerating` para deshabilitar el botón durante la operación y se configuraron alertas para notificar al usuario sobre el resultado.
4.  **Refresco Automático**: Se implementó un mecanismo con `useState` y `useEffect` (`refreshKey`) para forzar la recarga de los datos del dashboard después de que se generan los nuevos datos.
5.  **Actualización del Blueprint**: Se ha actualizado este archivo (`blueprint.md`) para documentar la nueva funcionalidad.