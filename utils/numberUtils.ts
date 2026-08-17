/**
 * Parsea el formato 00 Hrs. 00 Min. a minutos numericos
 */
export function parseHoursToMinutes(horasTexto: string): number {
  // Extrae las horas y los minutos ignorando espacios o variaciones de texto
  const match = horasTexto.match(/(\d+)\s*Hrs?\.\s*(\d+)\s*Min/i);

  if (!match) {
    // Respaldo general por si cambia ligeramente la puntuación (ej: "08 Hrs 00 Min")
    const numeros = horasTexto.match(/\d+/g);
    if (numeros && numeros.length >= 2) {
      return parseInt(numeros[0], 10) * 60 + parseInt(numeros[1], 10);
    }
    throw new Error(`No se pudo parsear el formato de tiempo: "${horasTexto}"`);
  }

  const horas = parseInt(match[1], 10);
  const minutos = parseInt(match[2], 10);

  return horas * 60 + minutos;
}