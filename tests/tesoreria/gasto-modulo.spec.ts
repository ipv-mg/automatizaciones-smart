import { test } from '@playwright/test';
import { LoginPage, TesoreriaPage } from '@pages';
import { solicitudesReembolso, TIPO } from '@data/tesoreriaData';

test.describe('Tesorería - Solicitudes de reembolso', () => {
  for (const datos of solicitudesReembolso) {
    test(`Registrar solicitud - ${datos.tipoSolicitud.trim()} - ${datos.motivo}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const tesoreria = new TesoreriaPage(page);

      await loginPage.navegar();
      await loginPage.iniciarSesion(datos.correo, datos.password);
      await tesoreria.navegarDesdeHome();

      switch (datos.tipoSolicitud) {
        case TIPO.ALIMENTACION:
          await tesoreria.llenarGastoAlimentacion(
            datos.fecha,
            datos.monto,
            datos.proyecto!,
            datos.requerimiento!,
            datos.personaSeleccionada!,
            datos.motivo,
          );
          break;

        case TIPO.MOVILIDAD:
          await tesoreria.llenarGastoMovilidad(
            datos.fecha,
            datos.monto,
            datos.proyecto!,
            datos.requerimiento!,
            datos.motivo,
          );
          break;

        case TIPO.COCHERAS:
          await tesoreria.llenarDevolucionCocheras(datos.fecha, datos.monto, datos.motivo);
          break;

        case TIPO.OTROS_GASTOS:
          await tesoreria.llenarOtrosGastos(
            datos.fecha,
            datos.monto,
            datos.proyecto!,
            datos.requerimiento!,
            datos.personaSeleccionada!,
            datos.motivo,
          );
          break;

        default:
          throw new Error(`Tipo de solicitud no soportado: ${datos.tipoSolicitud}`);
      }

      await tesoreria.subirComprobante(datos.archivoComprobante);
      await tesoreria.enviarSolicitud();
    });
  }
});