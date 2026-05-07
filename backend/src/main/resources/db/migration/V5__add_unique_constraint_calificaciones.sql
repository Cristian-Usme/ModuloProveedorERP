-- Garantizar que un usuario solo pueda tener una calificación por proveedor.
-- Si existen duplicados, conservar la más reciente y eliminar las demás.

DELETE FROM calificaciones_proveedor a
  USING calificaciones_proveedor b
  WHERE a.proveedor_id = b.proveedor_id
    AND a.usuario_id = b.usuario_id
    AND a.id < b.id;

-- Agregar constraint de unicidad
ALTER TABLE calificaciones_proveedor
  ADD CONSTRAINT uq_calificacion_proveedor_usuario
  UNIQUE (proveedor_id, usuario_id);

-- Campo para trackear actualización de calificación
ALTER TABLE calificaciones_proveedor
  ADD COLUMN IF NOT EXISTS actualizado_en TIMESTAMP;
