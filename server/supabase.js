require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Verificación de diagnóstico
if (!supabaseUrl) {
    console.error("\n❌ ERROR CRÍTICO: No se encontró SUPABASE_URL.");
    console.error("   Directorio actual de ejecución:", process.cwd());
    console.error("   Asegúrate de que el archivo .env esté en esta carpeta.\n");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;