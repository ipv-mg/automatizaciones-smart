export function calcularMinutosLaborados(marcas: string[]): number {
  if (marcas.length < 2) {
    return 0;
  }

  let total = 0;

  for (let i = 0; i < marcas.length - 1; i += 2) {
    const entrada = new Date(marcas[i]).getTime();
    const salida = new Date(marcas[i + 1]).getTime();

    total += (salida - entrada) / 60000;
  }

  return total;
}