-- Roles
INSERT INTO roles (nombre) VALUES ('ADMIN'), ('COMPRADOR'), ('CONSULTA');

-- Usuarios de prueba
-- password: Test1234! (BCrypt hash)
INSERT INTO usuarios (nombre, email, password)
VALUES ('Administrador', 'admin@upb.edu.co',
        '$2b$10$7ZUi6eKBJxlFAg0ZwVEZb.aOlGXcZEP8qbnswLuQtF1JOGH7KRjS2');

INSERT INTO usuarios (nombre, email, password)
VALUES ('Juan Comprador', 'comprador@upb.edu.co',
        '$2b$10$7ZUi6eKBJxlFAg0ZwVEZb.aOlGXcZEP8qbnswLuQtF1JOGH7KRjS2');

INSERT INTO usuarios (nombre, email, password)
VALUES ('Ana Consulta', 'consulta@upb.edu.co',
        '$2b$10$7ZUi6eKBJxlFAg0ZwVEZb.aOlGXcZEP8qbnswLuQtF1JOGH7KRjS2');

-- Asignación de roles a usuarios
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (1, 1);
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (2, 2);
INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (3, 3);
