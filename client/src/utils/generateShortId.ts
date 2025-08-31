/**
 * Genera un ID corto basado en la fecha y un número aleatorio.
 *
 * @returns Un ID corto.
 */
function generateShortId() {
   return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export default generateShortId
