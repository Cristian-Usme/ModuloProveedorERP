-- Índices para optimizar queries y escalabilidad
-- Esta migración mejora el rendimiento de búsquedas y filtros

-- ============================================
-- PROVEEDORES INDICES
-- ============================================
CREATE INDEX idx_proveedores_nombre ON proveedores(nombre);
CREATE INDEX idx_proveedores_ruc_nit ON proveedores(ruc_nit);
CREATE INDEX idx_proveedores_activo ON proveedores(activo);
CREATE INDEX idx_proveedores_email ON proveedores(email);
CREATE INDEX idx_proveedores_creado_en ON proveedores(creado_en DESC);

-- ============================================
-- PRODUCTOS INDICES
-- ============================================
CREATE INDEX idx_productos_proveedor ON productos(proveedor_id);
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_productos_proveedor_activo ON productos(proveedor_id, activo);

-- ============================================
-- ORDENES INDICES
-- ============================================
CREATE INDEX idx_ordenes_proveedor ON ordenes_compra(proveedor_id);
CREATE INDEX idx_ordenes_usuario ON ordenes_compra(usuario_id);
CREATE INDEX idx_ordenes_estado ON ordenes_compra(estado);
CREATE INDEX idx_ordenes_proveedor_estado ON ordenes_compra(proveedor_id, estado);
CREATE INDEX idx_ordenes_usuario_estado ON ordenes_compra(usuario_id, estado);
CREATE INDEX idx_ordenes_numero ON ordenes_compra(numero_orden);
CREATE INDEX idx_ordenes_creado_en ON ordenes_compra(fecha_creacion DESC);

-- ============================================
-- DETALLES ORDEN INDICES
-- ============================================
CREATE INDEX idx_detalles_orden ON detalles_orden(orden_id);
CREATE INDEX idx_detalles_producto ON detalles_orden(producto_id);

-- ============================================
-- CALIFICACIONES INDICES
-- ============================================
CREATE INDEX idx_calificaciones_proveedor ON calificaciones_proveedor(proveedor_id);
CREATE INDEX idx_calificaciones_usuario ON calificaciones_proveedor(usuario_id);
CREATE INDEX idx_calificaciones_proveedor_usuario ON calificaciones_proveedor(proveedor_id, usuario_id);

-- ============================================
-- USUARIOS INDICES
-- ============================================
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- ============================================
-- USUARIOS_ROLES INDICES
-- ============================================
CREATE INDEX idx_usuarios_roles_usuario ON usuarios_roles(usuario_id);
CREATE INDEX idx_usuarios_roles_rol ON usuarios_roles(rol_id);
