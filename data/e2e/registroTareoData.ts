import { UsuarioMarca, usuarios } from '@data/marcasData';
import { TareoData, tareo } from '@data/tareoData';

export interface RegistroTareoE2E {
  marca: UsuarioMarca;
  tareo: TareoData;
}

export const escenariosRegistroTareo: RegistroTareoE2E[] =
  tareo.map((registro) => ({
    marca: usuarios.find(usuario => usuario.correo === registro.correo)!,
    tareo: registro,
  }));