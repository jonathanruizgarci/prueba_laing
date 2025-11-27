import { createClient } from '@supabase/supabase-js';
// 1. Vite busca automáticamente en el archivo .env las variables que empiezan con VITE
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
//prueba error de conexión a supabase
console.log("URL Supabase:", supabaseUrl);
console.log("Key Supabase:", supabaseKey);

// 2. Usamos esas variables para conectar
export const supabase = createClient(supabaseUrl, supabaseKey);