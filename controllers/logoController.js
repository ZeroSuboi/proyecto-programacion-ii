const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Importamos el Modelo y las Herramientas del Algoritmo
const Logo = require('../models/logoModel');
const {
    generarHashPerceptual,
    calcularSimilitud,
} = require('../utils/hashPerceptual');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const userId = req.session.user.id;
        const uniqueSuffix = Date.now() + path.extname(file.originalname);
        cb(null, `logo-${userId}-${uniqueSuffix}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El archivo no es una imagen válida.'), false);
    }
};

// ⚙️ CONFIGURACIÓN ACTUALIZADA CON LÍMITE DE 2MB 👇
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 Megabytes en bytes
}).single('logo');

const logoController = {
    // 🛡️ MIDDLEWARE ACTUALIZADO PARA CAPTURAR EL ERROR DE TAMAÑO
    subirArchivo: (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                // Si Multer rechaza el archivo por el límite de tamaño
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res
                        .status(400)
                        .send(
                            '<h3>Error:</h3><p>El archivo es demasiado pesado. El límite máximo permitido es de 2MB.</p><br><a href="/dashboard">Volver a intentar</a>'
                        );
                }
                // Cualquier otro error de filtro de formato
                return res
                    .status(400)
                    .send(`Error al subir el archivo: ${err.message}`);
            }
            if (!req.file)
                return res
                    .status(400)
                    .send('Por favor, selecciona una imagen.');
            next();
        });
    },

    // Procesar la lógica de negocio y análisis analítico
    analizarYGuardarLogo: async (req, res) => {
        try {
            const usuario_id = req.session.user.id;
            const rutaFisicaArchivo = path.join(
                __dirname,
                '../uploads/',
                req.file.filename
            );
            const rutaImagenParaBD = `/uploads/${req.file.filename}`;

            // 1. Ejecutar algoritmo matemático local
            const hashReal = await generarHashPerceptual(rutaFisicaArchivo);

            // 2. Traer los logos competidores usando el MODELO 📦
            const logosExistentes =
                await Logo.obtenerTodosMenosUsuario(usuario_id);

            let mayorSimilitudEncontrada = 0;
            let estado = 'aprobado';

            // 3. Comparar las huellas en memoria
            for (const otroLogo of logosExistentes) {
                const similitud = calcularSimilitud(
                    hashReal,
                    otroLogo.hash_perceptual
                );
                if (similitud > mayorSimilitudEncontrada) {
                    mayorSimilitudEncontrada = similitud;
                }
            }

            // Umbral del 85% para determinar copia
            if (mayorSimilitudEncontrada >= 85.0) {
                estado = 'plagio_detectado';
                if (fs.existsSync(rutaFisicaArchivo)) {
                    fs.unlinkSync(rutaFisicaArchivo); // Borra el archivo del disco
                    console.log(
                        'Archivo físico rechazado eliminado con éxito.'
                    );
                }
                return res.render('productor/resultadoAnalisis', {
                    user: req.session.user,
                    hashReal: hashReal,
                    mayorSimilitudEncontrada: mayorSimilitudEncontrada,
                    estado: estado
                });
            }

            // 3. 🛡️ VALIDACIÓN DE REEMPLAZO PROTEGIDA
            const logoViejo = await Logo.obtenerPorUsuario(usuario_id);

            // Verificamos que exista el logo viejo Y que traiga una ruta de imagen válida
            if (logoViejo && logoViejo.ruta_imagen) {
                // Construimos la ruta absoluta de forma segura
                const rutaArchivoViejo = path.join(
                    __dirname,
                    '../',
                    logoViejo.ruta_imagen
                );

                // Solo intentamos borrar si el archivo realmente existe en el disco duro
                if (fs.existsSync(rutaArchivoViejo)) {
                    fs.unlinkSync(rutaArchivoViejo); // Borra el archivo del disco
                    console.log('Archivo físico anterior eliminado con éxito.');
                } else {
                    console.log(
                        'El archivo físico anterior no se encontró en el disco, saltando...'
                    );
                }

                // Borramos el registro viejo de la BD
                await Logo.eliminarPorUsuario(usuario_id);
            } else if (logoViejo) {
                // Si existía el registro pero no tenía ruta de imagen, limpiamos la BD de todos modos
                console.log(
                    'Se encontró un registro huérfano sin ruta de imagen. Limpiando BD...'
                );
                await Logo.eliminarPorUsuario(usuario_id);
            }

            // 4. Guardar los resultados a través del MODELO 📦
            await Logo.crear(
                usuario_id,
                rutaImagenParaBD,
                hashReal,
                mayorSimilitudEncontrada,
                estado
            );

            res.render('productor/resultadoAnalisis', {
                user: req.session.user,
                hashReal: hashReal,
                mayorSimilitudEncontrada: mayorSimilitudEncontrada,
                estado: estado
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(
                'Error local al procesar el análisis del logotipo'
            );
        }
    },
};

module.exports = logoController;