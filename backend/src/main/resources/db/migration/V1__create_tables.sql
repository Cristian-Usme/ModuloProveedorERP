-- Roles
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Usuarios
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Usuarios_Roles (M:M)
CREATE TABLE usuarios_roles (
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    rol_id     BIGINT NOT NULL REFERENCES roles(id),
    PRIMARY KEY (usuario_id, rol_id)
);

-- Proveedores
CREATE TABLE proveedores (
    id                    BIGSERIAL PRIMARY KEY,
    nombre                VARCHAR(150) NOT NULL,
    ruc_nit               VARCHAR(20)  NOT NULL UNIQUE,
    email                 VARCHAR(150),
    telefono              VARCHAR(20),
    direccion             TEXT,
    calificacion_promedio NUMERIC(3,2) DEFAULT 0.0,
    total_calificaciones  INT          DEFAULT 0,
    activo                BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en             TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Productos
CREATE TABLE productos (
    id               BIGSERIAL PRIMARY KEY,
    nombre           VARCHAR(150) NOT NULL,
    descripcion      TEXT,
    precio_referencia NUMERIC(12,2),
    unidad           VARCHAR(50),
    proveedor_id     BIGINT       NOT NULL REFERENCES proveedores(id),
    activo           BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en        TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Ordenes de Compra
CREATE TABLE ordenes_compra (
    id                  BIGSERIAL   PRIMARY KEY,
    numero_orden        VARCHAR(20) NOT NULL UNIQUE,
    fecha_creacion      TIMESTAMP   NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP,
    estado              VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    observaciones       TEXT,
    total               NUMERIC(14,2) NOT NULL DEFAULT 0.0,
    proveedor_id        BIGINT      NOT NULL REFERENCES proveedores(id),
    usuario_id          BIGINT      NOT NULL REFERENCES usuarios(id)
);

-- Detalles de Orden
CREATE TABLE detalles_orden (
    id              BIGSERIAL   PRIMARY KEY,
    orden_id        BIGINT      NOT NULL REFERENCES ordenes_compra(id),
    producto_id     BIGINT      NOT NULL REFERENCES productos(id),
    cantidad        INT         NOT NULL,
    precio_unitario NUMERIC(12,2) NOT NULL,
    subtotal        NUMERIC(14,2) NOT NULL
);

-- Calificaciones de Proveedor
CREATE TABLE calificaciones_proveedor (
    id           BIGSERIAL PRIMARY KEY,
    proveedor_id BIGINT    NOT NULL REFERENCES proveedores(id),
    usuario_id   BIGINT    NOT NULL REFERENCES usuarios(id),
    puntuacion   INT       NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario   TEXT,
    creado_en    TIMESTAMP NOT NULL DEFAULT NOW()
);
