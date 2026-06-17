const Usuario = require('../models/userModel');
const bcrypt = require('bcryptjs');


const authController = {
    // Metodo para registrar usuarios nuevos, recibe datos del formulario, valida la información, hashea su clave y inserta los datos en la base de datos
    register: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.send('Rellena todos los campos para continuar');
            }
            const usuarioExistente = await Usuario.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.send('Este correo ya esta en uso');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await Usuario.crear(email, hashedPassword, 'productor');
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.send('Rellena todos los campos para continuar');
            }
            const usuario = await Usuario.buscarPorEmail(email);
            if (!usuario) {
                return res.send('Este usuario no existe');
            }
            const passwordCorrecta = await bcrypt.compare(
                password,
                usuario.password
            );
            if (!passwordCorrecta) {
                return res.send('Contraseña incorrecta!');
            }
            req.session.user = {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
            };
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    },

    logout: (req, res) => {
        // Destruimos la sesión actual en el servidor
        req.session.destroy((err) => {
            if (err) {
                console.error('Error crítico al cerrar la sesión:', err);
                return res
                    .status(500)
                    .send('No se pudo cerrar la sesión correctamente.');
            }

            // Limpiamos la cookie del navegador por seguridad
            res.clearCookie('connect.sid');

            // Redirigimos al usuario a la pantalla de login
            res.redirect('/auth/login');
        });
    },
};

module.exports = authController;