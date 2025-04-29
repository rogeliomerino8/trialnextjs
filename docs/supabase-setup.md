# Configuración de Supabase

Este documento explica cómo configurar correctamente Supabase para este proyecto.

## Funciones RPC

Para que la aplicación funcione correctamente, es necesario crear las siguientes funciones RPC en Supabase:

### 1. Función para insertar categorías por defecto

Esta función permite insertar categorías predeterminadas en la tabla `categorias` sin necesidad de políticas RLS específicas.

```sql
-- Copiar esto y ejecutarlo en el Editor SQL de Supabase

CREATE OR REPLACE FUNCTION public.insertar_categorias_por_defecto()
RETURNS TABLE (id uuid, nombre text, descripcion text) 
LANGUAGE plpgsql
SECURITY DEFINER -- Importante: esto permite que la función se ejecute con los permisos del creador
AS $$
DECLARE
  inserted_categories UUID[];
  cat_id UUID;
  cat_count INT;
BEGIN
  -- Verificar si ya hay categorías
  SELECT COUNT(*) INTO cat_count FROM public.categorias;
  
  IF cat_count = 0 THEN
    -- Insertar categorías predeterminadas
    INSERT INTO public.categorias (nombre, descripcion)
    VALUES
      ('Tecnología', 'Proveedores de servicios tecnológicos y hardware'),
      ('Alimentos', 'Proveedores de alimentos y bebidas'),
      ('Servicios', 'Proveedores de servicios generales'),
      ('Construcción', 'Materiales y servicios de construcción'),
      ('Logística', 'Servicios de transporte y logística'),
      ('Manufactura', 'Fabricantes y maquiladoras'),
      ('Financiero', 'Servicios financieros y bancarios'),
      ('Salud', 'Equipamiento médico y servicios de salud')
    RETURNING id INTO inserted_categories;
  END IF;
  
  -- Devolver todas las categorías existentes
  RETURN QUERY SELECT c.id, c.nombre, c.descripcion FROM public.categorias c ORDER BY c.nombre;
END;
$$;
```

## Políticas de Seguridad de Filas (RLS)

Es necesario configurar las políticas de seguridad de filas para cada tabla. A continuación se detallan las políticas recomendadas:

```sql
-- Copiar esto y ejecutarlo en el Editor SQL de Supabase

-- Habilitar RLS para la tabla categorias
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios
CREATE POLICY categorias_select_policy ON categorias
  FOR SELECT USING (true);

-- Política para permitir inserción solo a usuarios autenticados
-- Nota: Esto es opcional, ya que puede ser preferible usar la función RPC
CREATE POLICY categorias_insert_policy ON categorias
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Habilitar RLS para la tabla proveedores
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios
CREATE POLICY proveedores_select_policy ON proveedores
  FOR SELECT USING (true);

-- Política para permitir inserción solo a usuarios autenticados
CREATE POLICY proveedores_insert_policy ON proveedores
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir actualización solo a usuarios autenticados
CREATE POLICY proveedores_update_policy ON proveedores
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Aplicar políticas similares para documentos y tipos_documentos
-- (Ver archivo sql/create_rls_policies.sql para todas las políticas)
```

## Solución de problemas comunes

### Error al insertar categorías

Si ves el siguiente error en la consola:

```
Error también al insertar directamente: {}
```

Esto indica que hay un problema con la función RPC `insertar_categorias_por_defecto` o con las políticas RLS. Sigue estos pasos para solucionarlo:

1. Verifica que la función `insertar_categorias_por_defecto` existe en Supabase:
   - Accede al panel de Supabase
   - Ve a Database > Functions
   - Asegúrate de que la función aparece en la lista

2. Si la función no existe:
   - Crea la función ejecutando el código SQL proporcionado anteriormente

3. Si la función existe pero sigue fallando:
   - Verifica las políticas RLS de la tabla `categorias`
   - Asegúrate de que la función tiene el atributo `SECURITY DEFINER`
   - Temporalmente, puedes desactivar RLS para pruebas: `ALTER TABLE categorias DISABLE ROW LEVEL SECURITY;`

### Usuario no autenticado

Si estás tratando de insertar datos sin estar autenticado, verás errores de permisos. Asegúrate de:

1. Tener configurada correctamente la autenticación en Supabase
2. Estar autenticado antes de realizar operaciones de escritura
3. Utilizar funciones RPC con `SECURITY DEFINER` para operaciones que deben funcionar sin autenticación 