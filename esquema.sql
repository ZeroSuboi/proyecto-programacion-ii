-- 1. Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS proyecto_agricola;
USE proyecto_agricola;

-- 1. CREAR LA TABLA DE USUARIOS
-- Guarda las credenciales de los productores con contraseñas encriptadas
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'productor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CREAR LA TABLA DE FINCAS
-- Vincula cada finca directamente con el ID del productor que la registró
CREATE TABLE IF NOT EXISTS fincas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(255) NOT NULL,
    hectareas DECIMAL(10, 2) NOT NULL,
    usuario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- 3. CREAR LA TABLA DE LOGOS (Para la función avanzada de marca)
-- Almacena la ruta de la imagen del logo y el estado de su análisis de plagio
CREATE TABLE IF NOT EXISTS logos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    ruta_imagen VARCHAR(255) NOT NULL,
    hash_perceptual VARCHAR(64) NOT NULL, 
    porcentaje_similitud DECIMAL(5, 2) DEFAULT 0.00,
    estado_analisis VARCHAR(50) DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);