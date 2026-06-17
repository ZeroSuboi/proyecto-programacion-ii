const express = require('express');
const router = express.Router();

const productorController = require('../controllers/productorController');
const fincaController = require('../controllers/fincaController');
const logoController = require('../controllers/logoController');

// Middleware (Exclusivo para estas rutas)
const verificarSesion = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// --- DASHBOARD PRINCIPAL ---
router.get('/dashboard', verificarSesion, productorController.mostrarDashboard);

// --- GESTIÓN DE FINCAS ---
router.get('/fincas', verificarSesion, fincaController.listarFincas);
router.get('/fincas/nueva', verificarSesion, fincaController.mostrarFormulario);
router.post('/fincas/nueva', verificarSesion, fincaController.registrarFinca);
router.get('/fincas/editar/:id', verificarSesion, fincaController.mostrarEditar);
router.post('/fincas/editar/:id', verificarSesion, fincaController.actualizarFinca);
router.get('/fincas/eliminar/:id', verificarSesion, fincaController.eliminarFinca); // Usamos GET por simplicidad para dispararlo desde un enlace rápido

// --- GESTIÓN DE LOGOS ---
// Ruta POST que recibe la imagen, ejecuta la subida física y luego la procesa en la BD
router.post('/productor/analizar-logo', verificarSesion, logoController.subirArchivo, logoController.analizarYGuardarLogo);

// --- GESTIÓN DE PERFIL DEL USUARIO ---
router.get('/perfil/editar', verificarSesion, productorController.mostrarEditarPerfil);
router.post('/perfil/editar', verificarSesion, productorController.actualizarPerfil);

// --- GESTIÓN DE SEGURIDAD (CONTRASEÑA) ---
router.get('/perfil/password', verificarSesion, productorController.mostrarCambiarPassword);
router.post('/perfil/password', verificarSesion, productorController.actualizarPassword);

module.exports = router;
module.exports = router;
