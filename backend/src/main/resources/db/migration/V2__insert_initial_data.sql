-- Roles
INSERT INTO roles (nombre) VALUES ('ADMIN'), ('COMPRADOR'), ('CONSULTA');

-- Usuarios de prueba
-- password: Admin2026!   → BCrypt hash
INSERT INTO usuarios (nombre, email, password)
VALUES ('Administrador', 'admin@upb.edu.co',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgK8bvkq/k8Z0B7rXf0Xii');

-- password: Test1234!
INSERT INTO usuarios (nombre, email, password)
VALUES ('Juan Comprador', 'comprador@upb.edu.co',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.ucrm50pCXi');

INSERT INTO usuarios (nombre, email, password)
VALUES ('Ana Consulta', 'consulta@upb.edu.co',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.ucrm50pCXi');

-- Asignación de roles
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (1, 1);
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (2, 2);
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (3, 3);

-- Proveedores de ejemplo
INSERT INTO proveedores (nombre, ruc_nit, email, telefono, direccion)
VALUES
    ('Suministros Tecnológicos S.A.', '900123456-1', 'ventas@sumitech.com',
     '604-555-0101', 'Calle 50 # 40-20, Medellín'),
    ('Distribuidora Industrial Ltda.', '830456789-2', 'pedidos@distindustrial.com',
     '604-555-0202', 'Carrera 43A # 1-50, Medellín');

-- Productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio_referencia, unidad, proveedor_id)
VALUES
    ('Laptop Empresarial 15"', 'Laptop Core i7, 16GB RAM, 512GB SSD', 3500000.00, 'Unidad', 1),
    ('Mouse Inalámbrico', 'Mouse ergonómico inalámbrico', 85000.00, 'Unidad', 1),
    ('Silla Ergonómica', 'Silla de oficina con soporte lumbar', 450000.00, 'Unidad', 2),
    ('Escritorio Ejecutivo', 'Escritorio en madera 180x80cm', 1200000.00, 'Unidad', 2);
