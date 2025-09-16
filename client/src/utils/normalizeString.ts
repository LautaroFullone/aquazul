/**
 * Normaliza un string para comparaciones insensibles a mayúsculas, acentos y espacios.
 *
 * @param value - El string a normalizar.
 * @returns El string normalizado.
 */

function normalizeString(value: string | undefined) {
   if (!value) return ''

   return (value ?? '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // quita acentos
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // colapsa múltiples espacios en uno
}

export default normalizeString
