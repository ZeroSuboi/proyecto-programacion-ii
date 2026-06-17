const Finca = require('../models/fincaModel');

const fincaController = {
    // Renderizar el formulario de registro de fincas
    mostrarFormulario: (req, res) => {
        res.render('productor/nuevaFinca', { user: req.session.user });
    },

    // Procesar e insertar la finca en la base de datos
    registrarFinca: async (req, res) => {
        try {
            const { nombre, ubicacion, hectareas } = req.body;

            if (!nombre || !ubicacion || !hectareas) {
                return res.send(
                    "<script>alert('Por favor, rellena todos los campos de la finca.'); window.history.back();</script>"
                );
            }

            const usuario_id = req.session.user.id;
            await Finca.crear(nombre, ubicacion, hectareas, usuario_id);
            res.redirect('/fincas');
        } catch (error) {
            console.error(error);
            res.status(500).send("<script>alert('Error interno al registrar la finca'); window.history.back();</script>");
        }
    },

    // Lista las fincas existentes del usuario
    listarFincas: async (req, res) => {
        try {
            const usuario_id = req.session.user.id;
            const fincas = await Finca.obtenerPorUsuario(usuario_id);
            if (!fincas || fincas.length === 0) {
                return res.send("<script>alert('No posees fincas para visualizar'); window.location.href='/dashboard';</script>");
            }
            res.render('productor/misFincas', {
                user: req.session.user,
                fincas: fincas,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("<script>alert('Error interno al buscar las fincas'); window.history.back();</script>");
        }
    },

    // Mostrar el formulario de edición con los datos precargados
    mostrarEditar: async (req, res) => {
        try {
            const fincaId = req.params.id;
            const finca = await Finca.obtenerPorId(fincaId);

            // Seguridad extra: Validar que la finca exista y pertenezca al usuario en sesión
            if (!finca || finca.usuario_id !== req.session.user.id) {
                return res
                    .status(403)
                    .send("<script>alert('No tienes permiso para editar esta finca.'); window.location.href='/fincas';</script>");
            }

            res.render('productor/editarFinca', {
                user: req.session.user,
                finca,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("<script>alert('Error al cargar la edición de la finca'); window.history.back();</script>");
        }
    },

    // Procesar los datos modificados de la finca
    actualizarFinca: async (req, res) => {
        try {
            const fincaId = req.params.id;
            const { nombre, ubicacion, hectareas } = req.body;

            // Volvemos a validar que le pertenezca antes de guardar
            const fincaOriginal = await Finca.obtenerPorId(fincaId);
            if (
                !fincaOriginal ||
                fincaOriginal.usuario_id !== req.session.user.id
            ) {
                return res.status(403).send("<script>alert('Acción no autorizada.'); window.location.href='/fincas';</script>");
            }

            await Finca.actualizar(fincaId, nombre, ubicacion, hectareas);
            res.redirect('/fincas');
        } catch (error) {
            console.error(error);
            res.status(500).send("<script>alert('Error al actualizar la finca'); window.history.back();</script>");
        }
    },

    // Procesar la eliminación de la finca
    eliminarFinca: async (req, res) => {
        try {
            const fincaId = req.params.id;

            // Validación de propiedad
            const finca = await Finca.obtenerPorId(fincaId);
            if (!finca || finca.usuario_id !== req.session.user.id) {
                return res.status(403).send("<script>alert('Acción no autorizada.'); window.location.href='/fincas';</script>");
            }

            await Finca.eliminar(fincaId);
            res.redirect('/fincas');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al eliminar la finca');
        }
    },
};

module.exports = fincaController;
