import { test } from '@playwright/test';
import { escenariosRegistroTareo } from '@data/e2e/registroTareoData';
import { CrearMarcasFlow } from '@flows/crearMarcasFlow';
import { LoginPage, TareoPage } from '@pages';
import { MarcasService } from '@services/marcasService';
import { calcularMinutosLaborados } from '@utils/calcularMinLaborados';

for (const escenario of escenariosRegistroTareo) {

  test(
    `Registro tareo E2E ${escenario.marca.correo}`,
    async ({ page, request }) => {

      test.setTimeout(120000);
      //const minutosEsperados = calcularMinutosLaborados(escenario.marca.dTiempo_Marca);

      const loginPage = new LoginPage(page);
      const tareoPage = new TareoPage(page);
      const marcasService = new MarcasService(request);
      const crearMarcasFlow = new CrearMarcasFlow(marcasService);

      // 1. Login
      await loginPage.navegar();
      await loginPage.iniciarSesion(escenario.marca.correo,escenario.marca.password ?? '');

      // 2. Crear marcas
      await crearMarcasFlow.ejecutar(page,escenario.marca);

      // 3. Abrir formulario y setear fecha
      switch(escenario.tareo.path){
        case 1: { await tareoPage.abrirFormularioRegistro(); break; }//registro desde card
        case 2: { await tareoPage.abrirFormularioRegistroDesdeModulo(); break; }//registro desde modulo tareo
        default: { throw new Error('No se ha indicado un flujo válido' ); } 
      }
      await tareoPage.setFecha(escenario.tareo.fecha);

      // 4. Registrar horas
      await tareoPage.llenarFormulario(escenario.tareo);

      const minutosDisponibles = await tareoPage.obtenerMinutosDisponibles();
      if (minutosDisponibles !== +escenario.tareo.minutos) {
        throw new Error(`Esperados ${+escenario.tareo.minutos} min, obtenidos ${minutosDisponibles} min`);
      }

      // 5. Guardar y enviar
      await tareoPage.guardarYEnviar();

    }
  );

}