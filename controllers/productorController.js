const Logo = require('../models/logoModel');
const Finca = require('../models/fincaModel');
const Usuario = require('../models/userModel');
const bcrypt = require('bcryptjs');

const productorController = {
    mostrarDashboard: async (req, res) => {
        try {
            const usuario_id = req.session.user.id;

            // 🔍 Traemos los datos más recientes del usuario de la BD por si se acaban de editar
            const datosUsuarioActualizados =
                await Usuario.buscarPorId(usuario_id);

            const miLogo = await Logo.obtenerPorUsuario(usuario_id);
            const totalFincas = await Finca.contarPorUsuario(usuario_id);

            res.render('productor/dashboard', {
                user: datosUsuarioActualizados, // 💡 Pasamos los datos frescos de la BD en lugar de los de la sesión vieja
                miLogo: miLogo || null,
                totalFincas: totalFincas || 0,
                alerta: req.query.analisis || req.query.perfil || null, // Captura alertas de logo o perfil
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el panel de control');
        }
    },

    // Muestra el formulario con los datos actuales precargados
    mostrarEditarPerfil: async (req, res) => {
        try {
            const usuario_id = req.session.user.id;
            const datosUsuario = await Usuario.buscarPorId(usuario_id);

            res.render('productor/editarPerfil', { user: datosUsuario });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar la pantalla de edición');
        }
    },

    // Procesa el cambio de correo electrónico
    actualizarPerfil: async (req, res) => {
        try {
            const usuario_id = req.session.user.id;
            const { email } = req.body; // Captura el nuevo correo desde el formulario

            // 1. Actualizamos en MySQL
            await Usuario.actualizarEmail(usuario_id, email);

            // 2. ¡CRÍTICO! Actualizamos la sesión en memoria de Node.js para evitar inconsistencias
            req.session.user.email = email;

            // Redirigimos al dashboard con la alerta correspondiente
            res.redirect('/dashboard?perfil=actualizado');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al actualizar el correo electrónico');
        }
    },

    // Muestra el formulario para cambiar contraseña
    mostrarCambiarPassword: async (req, res) => {
        try {
            res.render('productor/cambiarPassword');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar la pantalla de seguridad');
        }
    },

    // Procesa y encripta la nueva contraseña
    actualizarPassword: async (req, res) => {
        try {
            const usuario_id = req.session.user.id;
            const { nuevaPassword, confirmarPassword } = req.body;

            // 1. Validación básica: que ambas contraseñas coincidan
            if (nuevaPassword !== confirmarPassword) {
                return res
                    .status(400)
                    .send(
                        "<script>alert('Las contraseñas escritas no coinciden.'); window.history.back();</script>"
                    );
            }

            // 2. Encriptamos la nueva contraseña antes de tocar la BD
            const passwordEncriptada = await bcrypt.hash(nuevaPassword, 10);

            // 3. Guardamos el Hash resultante en MySQL
            await Usuario.actualizarPassword(usuario_id, passwordEncriptada);

            // Redirigimos al dashboard con una bandera de éxito diferente
            res.redirect('/dashboard?perfil=password_cambiada');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno al cambiar la contraseña');
        }
    },
};

module.exports = productorController;
