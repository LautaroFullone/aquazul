/**
 * Normaliza un string eliminando acentos y convirtiendo a minúsculas.
 *
 * @param value - El string a normalizar.
 * @returns El string normalizado.
 */

function normalizeString(value: string) {
   return (value ?? '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
}

export default normalizeString
