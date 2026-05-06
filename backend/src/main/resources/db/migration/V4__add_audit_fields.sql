-- Agregar campos de auditoría a todas las tablas para escalabilidad y compliance
-- Esto permite rastrear quién y cuándo se modifican los datos

-- ============================================
-- AUDITORÍA EN PROVEEDORES
-- ============================================
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS updated_by BIGINT;
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE proveedores ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;

-- ============================================
-- AUDITORÍA EN PRODUCTOS
-- ============================================
ALTER TABLE productos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS updated_by BIGINT;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;

-- ============================================
-- AUDITORÍA EN ORDENES_COMPRA
-- ============================================
ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE ordenes_compra ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;

-- ============================================
-- AUDITORÍA EN USUARIOS
-- ============================================
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;

-- ============================================
-- ÍNDICES PARA AUDITORÍA
-- ============================================
CREATE INDEX IF NOT EXISTS idx_proveedores_updated_by ON proveedores(updated_by);
CREATE INDEX IF NOT EXISTS idx_proveedores_deleted_at ON proveedores(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_last_login ON usuarios(last_login DESC);
