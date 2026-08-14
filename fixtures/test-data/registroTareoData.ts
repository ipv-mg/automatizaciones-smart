import { usuarios } from '@data/marcasData';
import { tareo } from '@data/tareoData';

export interface RegistroTareoE2E {
  marca: typeof usuarios[number];
  tareo: typeof tareo[number];
}

export const escenariosRegistroTareo: RegistroTareoE2E[] = tareo.map((registro) => {
  const marca = usuarios.find((u) => u.correo === registro.correo);

  if (!marca) {
    throw new Error(`No existe usuario para ${registro.correo}`);
  }

  return { marca, tareo: registro };
});