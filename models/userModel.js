const pool = require('../config/db');

// Objeto Usuario, que contiene dos metodos para comunicarse con la base de datos
const Usuario = {
    crear: async (email, password, rol) => {
        const sql = 'INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)';
        const [resultado] = await pool.query(sql, [email, password, rol]);
        return resultado;
    },

    buscarPorEmail: async (email) => {
        const sql = 'SELECT * FROM usuarios WHERE email = ?';
        const [resultado] = await pool.query(sql, [email]);
        return resultado[0];
    }
};

module.exports = Usuario;