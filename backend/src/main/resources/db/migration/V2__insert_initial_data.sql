-- Roles
INSERT INTO roles (nombre) VALUES ('ADMIN'), ('COMPRADOR'), ('CONSULTA');

-- Usuarios de prueba
-- password: Test1234! (BCrypt hash)
INSERT INTO usuarios (nombre, email, password)
VALUES ('Administrador', 'admin@upb.edu.co',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.ucrm50pCXi');

INSERT INTO usuarios (nombre, email, password)
VALUES ('Juan Comprador', 'comprador@upb.edu.co',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.ucrm50pCXi');

INSERT INTO usuarios (nombre, email, password)
VALUES ('Ana Consulta', 'consulta@upb.edu.co',
        '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.ucrm50pCXi');

-- Asignación de roles a usuarios
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (1, 1);
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (2, 2);
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (3, 3);
