/**
 * Calcula la diferencia de meses entre una fecha objetivo y una fecha actual.
 * @param fechaObjetivo La fecha a la que se desea llegar.
 * @param fechaActual La fecha desde donde se parte (por defecto hoy).
 * @returns El número de meses de diferencia. Positivo si objetivo es futuro, negativo si es pasado.
 */
export function calcularDiferenciaMeses(fechaObjetivo: Date, fechaActual: Date = new Date()): number {
  const anioObjetivo = fechaObjetivo.getFullYear();
  const mesObjetivo = fechaObjetivo.getMonth();
  
  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth();

  return (anioObjetivo - anioActual) * 12 + (mesObjetivo - mesActual);
}

/**
 * Parsea un string de fecha (ej. "21/7/2026" o "9 de julio de 2026") a un objeto Date.
 */
export function parseDate(fechaInput: string): Date {
  const mesMap: Record<string, number> = {
    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
    'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
  };
  
  const lowerStr = fechaInput.toLowerCase();
  
  if (lowerStr.includes('/')) {
    const parts = lowerStr.split('/');
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  }

  for (const [mes, index] of Object.entries(mesMap)) {
    if (lowerStr.includes(mes)) {
      const matchDay = lowerStr.match(/(\d+)/);
      const dia = matchDay ? parseInt(matchDay[1]) : 1;
      
      const matchYear = lowerStr.match(/(20\d\d)/);
      const anio = matchYear ? parseInt(matchYear[1]) : new Date().getFullYear();
      
      return new Date(anio, index, dia);
    }
  }

  return new Date(fechaInput);
}

/**
 * Formatea una fecha al formato de aria-label común en Angular (ej. "9 de julio de 2026").
 */
export function formatAriaLabelDate(date: Date): string {
  if (isNaN(date.getTime())) return '';
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${date.getDate()} de ${meses[date.getMonth()]} de ${date.getFullYear()}`;
}
