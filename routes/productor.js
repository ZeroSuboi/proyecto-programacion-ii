const express = require('express');
const router = express.Router();
const fincaController = require('../controllers/fincaController');

// Middleware (Exclusivo para estas rutas)
const verificarSesion = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/auth/login');
};

// --- DASHBOARD PRINCIPAL ---
router.get('/dashboard', verificarSesion, (req, res) => {
    res.render('productor/dashboard', { user: req.session.user });
});

// --- GESTIÓN DE FINCAS ---
// Ver el formulario
router.get('/fincas/nueva', verificarSesion, fincaController.mostrarFormulario);
// Procesar el formulario
router.post('/fincas/nueva', verificarSesion, fincaController.registrarFinca);

// --- FUTURO APARTADO DEL LOGO (Próximamente con Hashes Perceptuales) ---
// router.post('/analizar-logo', verificarSesion, ...);

module.exports = router;
