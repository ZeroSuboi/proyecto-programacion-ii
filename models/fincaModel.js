const pool = require('../config/db');

const Finca = {
    // Inserta una nueva finca asociada al ID del productor
    crear: async (nombre, ubicacion, hectareas, usuario_id) => {
        const sql = 'INSERT INTO fincas (nombre, ubicacion, hectareas, usuario_id) VALUES (?, ?, ?, ?)';
        const [resultado] = await pool.query(sql, [nombre, ubicacion, hectareas, usuario_id]);
        return resultado;
    },

    // Trae todas las fincas de un productor específico
    obtenerPorUsuario: async (usuario_id) => {
        const sql = 'SELECT * FROM fincas WHERE usuario_id = ?';
        const [resultado] = await pool.query(sql, [usuario_id]);
        return resultado;
    }
};

module.exports = Finca;