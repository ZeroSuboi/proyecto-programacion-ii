// Requerimiento de dependencias
require('dotenv').config();
const express = require('express');
const path = require('path');

// Importar pool de base de datos
const pool = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/auth')

const app = express();
const PORT = process.env.PORT || 5000

// Configuraciones de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuraciones de peticiones
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

// Arranque del servidor
app.listen(PORT, () => {
    console.log(`activo en http://localhost:${PORT}`);
});