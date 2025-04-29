-- Función para insertar categorías por defecto
-- Esta función debe ser ejecutada en la consola SQL de Supabase

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