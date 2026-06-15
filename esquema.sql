-- 1. Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS proyecto_agricola;
USE proyecto_agricola;

-- 2. Tabla de Usuarios (Credenciales y Roles)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'productor') DEFAULT 'productor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabla de Productores (Datos Personales)
CREATE TABLE IF NOT EXISTS productores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    estado VARCHAR(50) NOT NULL, -- Aquí se guardará el estado de Venezuela
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Tabla de Fincas / Predios
CREATE TABLE IF NOT EXISTS fincas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productor_id INT NOT NULL,
    nombre_finca VARCHAR(150) NOT NULL,
    hectareas DECIMAL(10, 2) NOT NULL,
    municipio VARCHAR(100) NOT NULL,
    rubro_principal VARCHAR(100) NOT NULL, -- Ejemplo: Ganadería, Maíz, Café, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productor_id) REFERENCES productores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Insertar un Administrador por defecto (Opcional, para pruebas iniciales)
-- Nota: En producción, la contraseña deberías encriptarla con bcrypt. 
-- Esto es solo para que tengas una cuenta admin inicial (Contraseña propuesta: admin123)
INSERT INTO usuarios (email, password, rol) 
VALUES ('admin@agro.com', '$2b$10$EfxmC5.7dafHn1reEJDgOe1bXJc15M6Z7yP4m4Hj.6dFw80Z4zSvi', 'admin')
ON DUPLICATE KEY UPDATE email=email;