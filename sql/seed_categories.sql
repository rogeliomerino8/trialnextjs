-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Tecnología', 'Proveedores de servicios tecnológicos y hardware'),
  ('Alimentos', 'Proveedores de alimentos y bebidas'),
  ('Servicios', 'Proveedores de servicios generales'),
  ('Construcción', 'Materiales y servicios de construcción'),
  ('Logística', 'Servicios de transporte y logística'),
  ('Manufactura', 'Fabricantes y maquiladoras'),
  ('Financiero', 'Servicios financieros y bancarios'),
  ('Salud', 'Equipamiento médico y servicios de salud')
ON CONFLICT (id) DO NOTHING; 