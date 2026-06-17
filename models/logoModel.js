const pool = require('../config/db');

const Logo = {
    // Insertar un nuevo logotipo analizado
    crear: async (
        usuario_id,
        ruta_imagen,
        hash_perceptual,
        porcentaje_similitud,
        estado_analisis
    ) => {
        const sql = `
            INSERT INTO logos (usuario_id, ruta_imagen, hash_perceptual, porcentaje_similitud, estado_analisis) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [resultado] = await pool.query(sql, [
            usuario_id,
            ruta_imagen,
            hash_perceptual,
            porcentaje_similitud,
            estado_analisis,
        ]);
        return resultado;
    },

    // Obtener los logos de los DEMÁS usuarios para poder comparar (excluyendo al usuario actual)
    obtenerTodosMenosUsuario: async (usuario_id) => {
        const sql = 'SELECT * FROM logos WHERE usuario_id != ?';
        const [resultado] = await pool.query(sql, [usuario_id]);
        return resultado;
    },

    // Obtener el historial de logos de un usuario específico (por si lo necesitas en el futuro)
    obtenerPorUsuario: async (usuario_id) => {
        const sql = 'SELECT * FROM logos WHERE usuario_id = ?';
        const [resultado] = await pool.query(sql, [usuario_id]);
        return resultado[0];
    },

    // Eliminar el logo anterior de la base de datos
    eliminarPorUsuario: async (usuario_id) => {
        const sql = 'DELETE FROM logos WHERE usuario_id = ?';
        await pool.query(sql, [usuario_id]);
    },
};

module.exports = Logo;
