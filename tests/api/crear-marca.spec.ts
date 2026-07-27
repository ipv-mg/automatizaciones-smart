import { test } from '@playwright/test';
import { usuarios } from '@data/marcasData';
import { CrearMarcasFlow } from '@flows/crearMarcasFlow';
import { MarcasService } from '@services/marcasService';


for (const usuario of usuarios) {

  test(
    `Creación de marcas - ${usuario.correo}`,
    async ({ browser, request }) => {


      const marcasService =
        new MarcasService(request);


      const crearMarcasFlow =
        new CrearMarcasFlow(
          browser,
          marcasService
        );


      await crearMarcasFlow.ejecutar(usuario);

    }
  );

}