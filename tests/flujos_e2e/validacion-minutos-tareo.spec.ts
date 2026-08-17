import { expect, test } from '@fixtures/test';
import { escenariosRegistroTareo } from '@fixtures/test-data/registroTareoData';
import { CrearMarcasFlow } from '@flows/crearMarcasFlow';
import { LoginPage, TareoPage } from '@pages';
import { MarcasService } from '@services/marcasService';
import { TipoHora } from '@data/tareoData';

/**
 * Test para validar que el tiempo que muestra el aplicativo
 * coincida con las @marcas creadas desde el flow de crearMarcas (marcas REGULARES)
 */
for (const escenario of escenariosRegistroTareo) {
  if (!escenario.marca) {
    throw new Error(`No existe información de marcas para el usuario ${escenario.tareo.correo}`);
  }

  test(
    `Validacion de minutos-tareo ${escenario.marca.correo}`,async ({ page, request, usuarioRepository }) => {

      test.setTimeout(120000);

      const loginPage = new LoginPage(page);
      const tareoPage = new TareoPage(page);
      const flow = new CrearMarcasFlow(new MarcasService(request), usuarioRepository);

      /**
       * Inicio de sesion
       */
      await loginPage.navegar();
      await loginPage.iniciarSesion(escenario.marca.correo,escenario.marca.password ?? '');

      /**
       * Se ejecuta la creación de marcas actualmente no valida que ya existan marcas pero si ya existen no las registra (status 200 pero sin efecto)
       */
      await flow.ejecutar(page,escenario.marca);

      /**
       * Se abre el modulo de tareo, el formulario y se ingresa la fecha, HORAS REGULARES se toman por defecto
       */
      await tareoPage.abrirFormularioRegistro(); //registro desde modulo tareo
      await tareoPage.setFecha(escenario.tareo.fecha[0]);
      
      /**
       * Validaciones en los tiempos disponibles segun las marcas
       */
      const minutosRegularesDisponibles = await tareoPage.obtenerMinutosDisponibles();
      const minutosEsperados = Number(escenario.tareo.minutosRegulares);
      await expect(minutosRegularesDisponibles).toBe(minutosEsperados);

      if(escenario.tareo.minutosNoRegulares){
        await tareoPage.setTipoHora(TipoHora.AVANCE);
        const minutosNoRegularesDisponibles = await tareoPage.obtenerMinutosDisponibles();
        const minutoNoRegularesEsperados = Number(escenario.tareo.minutosNoRegulares);
        await expect(minutosNoRegularesDisponibles).toBe(minutoNoRegularesEsperados);
      }

    }
  );

}