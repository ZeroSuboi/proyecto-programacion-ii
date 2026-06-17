// Requerimiento de dependencias
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');

// Importar pool de base de datos
const pool = require('./config/db');

// Importar rutas
const authRoutes = require('./routes/auth')
const productorRoutes = require('./routes/productor');

const app = express();
const PORT = process.env.PORT || 5000

// Configuraciones de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuraciones de peticiones
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'maurizeus', // Una frase aleatoria para firmar la cookie
        resave: false, // Evita que la sesión se vuelva a guardar si no hubo cambios
        saveUninitialized: false, // No guarda sesiones vacías (ahorra memoria)
        cookie: {
            secure: false, // Pon 'true' solo si usas HTTPS (en localhost va false)
            maxAge: 1000 * 60 * 60 * 2, // Duración de la sesión: 2 horas en milisegundos
        },
    })
);

// Conexión con los enrutadores
app.use('/auth', authRoutes);
app.use('/', productorRoutes);

app.get('/', (req, res) => {
    res.render('./auth/register'); // Busca automáticamente en la carpeta 'views' el archivo register.ejs
});

// Arranque del servidor
app.listen(PORT, () => {
    console.log(`activo en http://localhost:${PORT}`);
});