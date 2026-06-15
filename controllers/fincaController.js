const Finca = require('../models/fincaModel');

const fincaController = {
    // 1. Renderizar el formulario de registro de fincas
    mostrarFormulario: (req, res) => {
        res.render('productor/nuevaFinca', { user: req.session.user });
    },

    // 2. Procesar e insertar la finca en la base de datos
    registrarFinca: async (req, res) => {
        try {
            const { nombre, ubicacion, hectareas } = req.body;

            if (!nombre || !ubicacion || !hectareas) {
                return res.send(
                    'Por favor, rellena todos los campos de la finca.'
                );
            }

            const usuario_id = req.session.user.id;
            await Finca.crear(nombre, ubicacion, hectareas, usuario_id);
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno al registrar la finca');
        }
    },
};

module.exports = fincaController;
