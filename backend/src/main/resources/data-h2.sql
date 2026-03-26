-- Roles
INSERT INTO roles (nombre) VALUES ('ADMIN');
INSERT INTO roles (nombre) VALUES ('COMPRADOR');
INSERT INTO roles (nombre) VALUES ('CONSULTA');

-- Usuarios (BCrypt de "Test1234!")
INSERT INTO usuarios (nombre, email, password, activo, creado_en)
VALUES ('Administrador', 'admin@upb.edu.co',
        '$2b$10$7ZUi6eKBJxlFAg0ZwVEZb.aOlGXcZEP8qbnswLuQtF1JOGH7KRjS2', true, NOW());

INSERT INTO usuarios (nombre, email, password, activo, creado_en)
VALUES ('Juan Comprador', 'comprador@upb.edu.co',
        '$2b$10$7ZUi6eKBJxlFAg0ZwVEZb.aOlGXcZEP8qbnswLuQtF1JOGH7KRjS2', true, NOW());

INSERT INTO usuarios (nombre, email, password, activo, creado_en)
VALUES ('Ana Consulta', 'consulta@upb.edu.co',
        '$2b$10$7ZUi6eKBJxlFAg0ZwVEZb.aOlGXcZEP8qbnswLuQtF1JOGH7KRjS2', true, NOW());

-- Roles
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (1, 1);
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (2, 2);
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (3, 3);

-- Proveedores
INSERT INTO proveedores (nombre, ruc_nit, email, telefono, direccion, calificacion_promedio, total_calificaciones, activo, creado_en)
VALUES ('Suministros Tecnológicos S.A.', '900123456-1', 'ventas@sumitech.com', '604-555-0101', 'Calle 50 # 40-20, Medellín', 0.0, 0, true, NOW());

INSERT INTO proveedores (nombre, ruc_nit, email, telefono, direccion, calificacion_promedio, total_calificaciones, activo, creado_en)
VALUES ('Distribuidora Industrial Ltda.', '830456789-2', 'pedidos@distindustrial.com', '604-555-0202', 'Carrera 43A # 1-50, Medellín', 4.5, 2, true, NOW());

-- Productos
INSERT INTO productos (nombre, descripcion, precio_referencia, unidad, proveedor_id, activo, creado_en)
VALUES ('Laptop Empresarial 15"', 'Laptop Core i7, 16GB RAM, 512GB SSD', 3500000.00, 'Unidad', 1, true, NOW());

INSERT INTO productos (nombre, descripcion, precio_referencia, unidad, proveedor_id, activo, creado_en)
VALUES ('Mouse Inalámbrico', 'Mouse ergonómico inalámbrico', 85000.00, 'Unidad', 1, true, NOW());

INSERT INTO productos (nombre, descripcion, precio_referencia, unidad, proveedor_id, activo, creado_en)
VALUES ('Silla Ergonómica', 'Silla de oficina con soporte lumbar', 450000.00, 'Unidad', 2, true, NOW());

INSERT INTO productos (nombre, descripcion, precio_referencia, unidad, proveedor_id, activo, creado_en)
VALUES ('Escritorio Ejecutivo', 'Escritorio en madera 180x80cm', 1200000.00, 'Unidad', 2, true, NOW());
