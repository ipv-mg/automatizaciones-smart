import { usuarios } from '@data/marcasData';
import { tareo } from '@data/tareoData';

export interface RegistroTareoE2E {
  marca: (typeof usuarios)[number];
  tareo: (typeof tareo)[number];
}

export const escenariosRegistroTareo: RegistroTareoE2E[] =
  tareo.map((registro): RegistroTareoE2E => {

    const marca = usuarios.find(
      usuario => usuario.correo === registro.correo
    );

    if (!marca) {
      throw new Error(
        `No existe información de marcas para el usuario ${registro.correo}`
      );
    }

    return {
      marca,
      tareo: registro
    };
});