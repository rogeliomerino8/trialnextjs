-- Políticas de seguridad de Filas (RLS) para las tablas

-- Habilitar RLS para la tabla categorias
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios
CREATE POLICY categorias_select_policy ON categorias
  FOR SELECT USING (true);

-- Política para permitir inserción solo a usuarios autenticados
-- Nota: Esto es opcional, ya que puede ser preferible usar la función RPC 
-- insertar_categorias_por_defecto con SECURITY DEFINER
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

-- Habilitar RLS para la tabla documentos
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios
CREATE POLICY documentos_select_policy ON documentos
  FOR SELECT USING (true);

-- Política para permitir inserción solo a usuarios autenticados
CREATE POLICY documentos_insert_policy ON documentos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir actualización solo a usuarios autenticados
CREATE POLICY documentos_update_policy ON documentos
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Habilitar RLS para la tabla tipos_documentos
ALTER TABLE tipos_documentos ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos los usuarios
CREATE POLICY tipos_documentos_select_policy ON tipos_documentos
  FOR SELECT USING (true);

-- Política para permitir inserción solo a usuarios autenticados
CREATE POLICY tipos_documentos_insert_policy ON tipos_documentos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 