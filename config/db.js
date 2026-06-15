const { createPool } = require('mysql2/promise');

// Se crea una pool, una serie de conexiones para comunicarse con la base de datos en mysql
const pool = createPool({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = pool;