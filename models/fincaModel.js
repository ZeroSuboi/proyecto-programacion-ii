const pool = require('../config/db');

const Finca = {
    // Inserta una nueva finca asociada al ID del productor
    crear: async (nombre, ubicacion, hectareas, usuario_id) => {
        const sql =
            'INSERT INTO fincas (nombre, ubicacion, hectareas, usuario_id) VALUES (?, ?, ?, ?)';
        const [resultado] = await pool.query(sql, [
            nombre,
            ubicacion,
            hectareas,
            usuario_id,
        ]);
        return resultado;
    },

    // Trae todas las fincas de un productor específico
    obtenerPorUsuario: async (usuario_id) => {
        const sql = 'SELECT * FROM fincas WHERE usuario_id = ?';
        const [resultado] = await pool.query(sql, [usuario_id]);
        return resultado;
    },

    // Obtener una sola finca por su ID (para cargar sus datos en el formulario de edición)
    obtenerPorId: async (id) => {
        const sql = 'SELECT * FROM fincas WHERE id = ?';
        const [resultado] = await pool.query(sql, [id]);
        return resultado[0]; // Retornamos solo el primer registro encontrado
    },

    // Actualizar los datos de una finca existente
    actualizar: async (id, nombre, ubicacion, hectareas) => {
        const sql =
            'UPDATE fincas SET nombre = ?, ubicacion = ?, hectareas = ? WHERE id = ?';
        const [resultado] = await pool.query(sql, [
            nombre,
            ubicacion,
            hectareas,
            id,
        ]);
        return resultado;
    },

    // Eliminar una finca por su ID
    eliminar: async (id) => {
        const sql = 'DELETE FROM fincas WHERE id = ?';
        const [resultado] = await pool.query(sql, [id]);
        return resultado;
    },

    contarPorUsuario: async (usuario_id) => {
        const sql = 'SELECT COUNT(*) AS total FROM fincas WHERE usuario_id = ?';
        const [resultado] = await pool.query(sql, [usuario_id]);
        return resultado[0].total; // Retorna directamente el número entero (ej: 3)
    },
};

module.exports = Finca;