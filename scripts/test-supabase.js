// Script para probar la conexión a Supabase y la tabla de categorías
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('Iniciando prueba de conexión a Supabase...');

// Variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('URL de Supabase:', supabaseUrl);
console.log('Clave anónima:', supabaseKey ? '[PRESENTE]' : '[AUSENTE]');

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Variables de entorno de Supabase no configuradas.');
  process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  try {
    console.log('\n1. Verificando conexión a Supabase...');
    const { error: connError } = await supabase.from('categorias').select('count');
    if (connError) {
      throw new Error(`Error de conexión: ${JSON.stringify(connError)}`);
    }
    console.log('✅ Conexión a Supabase establecida correctamente.\n');

    console.log('2. Obteniendo lista de categorías...');
    const { data: categorias, error: catError } = await supabase
      .from('categorias')
      .select('*')
      .order('nombre');

    if (catError) {
      throw new Error(`Error al obtener categorías: ${JSON.stringify(catError)}`);
    }

    console.log(`✅ Se encontraron ${categorias.length} categorías:`);
    categorias.forEach(cat => {
      console.log(`   - ${cat.id}: ${cat.nombre} (${cat.descripcion || 'Sin descripción'})`);
    });

    if (categorias.length === 0) {
      console.log('\n3. No hay categorías, insertando algunas predeterminadas...');
      
      const defaultCategorias = [
        { nombre: 'Tecnología', descripcion: 'Proveedores de servicios tecnológicos y hardware' },
        { nombre: 'Alimentos', descripcion: 'Proveedores de alimentos y bebidas' },
        { nombre: 'Servicios', descripcion: 'Proveedores de servicios generales' },
        { nombre: 'Construcción', descripcion: 'Materiales y servicios de construcción' }
      ];
      
      const { data: insertedData, error: insertError } = await supabase
        .from('categorias')
        .insert(defaultCategorias)
        .select();
        
      if (insertError) {
        throw new Error(`Error al insertar categorías predeterminadas: ${JSON.stringify(insertError)}`);
      }
      
      console.log(`✅ Se insertaron ${insertedData.length} categorías predeterminadas.`);
      insertedData.forEach(cat => {
        console.log(`   - ${cat.id}: ${cat.nombre}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
}

runTests(); 