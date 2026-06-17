const sharp = require('sharp');
const fs = require('fs')

/**
 * Calcula un Hash Perceptual (dHash) de forma nativa usando Sharp.
 * Reduce la imagen a 9x8 en escala de grises y compara los píxeles adyacentes.
 * Genera una huella digital hexadecimal exacta de 16 caracteres.
 */
async function generarHashPerceptual(rutaImagen) {
    try {
        // 1. CORRECCIÓN: Leemos primero el archivo como un Buffer puro de Node.js
        // Esto hace que el archivo se abra y se cierre en milisegundos, liberándolo de inmediato.
        const archivoBuffer = fs.readFileSync(rutaImagen);

        // 2. Pasamos el Buffer a Sharp en lugar de la ruta directa del archivo
        const { data } = await sharp(archivoBuffer)
            .greyscale()
            .resize(9, 8, { fit: 'fill' })
            .raw()
            .toBuffer({ resolveWithObject: true });

        let hashBinario = '';

        // Algoritmo dHash (Se mantiene idéntico)
        for (let fila = 0; fila < 8; fila++) {
            for (let col = 0; col < 8; col++) {
                const indicePixelActual = fila * 9 + col;
                const pixelActual = data[indicePixelActual];
                const pixelSiguiente = data[indicePixelActual + 1];

                hashBinario += pixelActual > pixelSiguiente ? '1' : '0';
            }
        }

        let hashHexadecimal = '';
        for (let i = 0; i < hashBinario.length; i += 4) {
            const grupoCuatroBits = hashBinario.substring(i, i + 4);
            hashHexadecimal += parseInt(grupoCuatroBits, 2).toString(16);
        }

        return hashHexadecimal;
    } catch (error) {
        console.error('Error al calcular el hash perceptual nativo:', error);
        throw error;
    }
}

/**
 * Compara dos hashes usando la Distancia de Hamming
 */
function calcularSimilitud(hash1, hash2) {
    if (!hash1 || !hash2 || hash1.length !== hash2.length) return 0;

    let bitsDiferentes = 0;
    for (let i = 0; i < hash1.length; i++) {
        const num1 = parseInt(hash1[i], 16);
        const num2 = parseInt(hash2[i], 16);

        let xor = num1 ^ num2;
        while (xor > 0) {
            if (xor & 1) bitsDiferentes++;
            xor >>= 1;
        }
    }

    const totalBits = hash1.length * 4; // 16 * 4 = 64 bits
    const porcentajeDiferencia = (bitsDiferentes / totalBits) * 100;

    return 100 - porcentajeDiferencia;
}

module.exports = { generarHashPerceptual, calcularSimilitud };
