const pool = require('../config/db');

// Objeto Usuario, que contiene dos metodos para comunicarse con la base de datos
const Usuario = {
    crear: async (email, password, rol) => {
        const sql =
            'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)';
        const [resultado] = await pool.query(sql, [email, password, rol]);
        return resultado;
    },

    buscarPorEmail: async (email) => {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const [resultado] = await pool.query(sql, [email]);
        return resultado[0];
    },

    // Actualizar la información del perfil del usuario
    actualizarEmail: async (usuario_id, nuevoEmail) => {
        const sql = 'UPDATE usuarios SET email = ? WHERE id = ?';
        const [resultado] = await pool.query(sql, [nuevoEmail, usuario_id]);
        return resultado;
    },

    buscarPorId: async (id) => {
        const sql = 'SELECT * FROM usuarios WHERE id = ?';
        const [resultado] = await pool.query(sql, [id]);
        return resultado[0];
    },

    actualizarPassword: async (usuario_id, passwordEncriptada) => {
        const sql = 'UPDATE usuarios SET password = ? WHERE id = ?';
        const [resultado] = await pool.query(sql, [
            passwordEncriptada,
            usuario_id,
        ]);
        return resultado;
    },
};

module.exports = Usuario;