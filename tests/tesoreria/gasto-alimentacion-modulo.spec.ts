import { test } from '@playwright/test';
import { LoginPage, TesoreriaPage } from '@pages';
import { gastosAlimentacion } from '@data/tesoreriaData';

for (const gasto of gastosAlimentacion) {
  test(`Solicitud de gasto por alimentación para ${gasto.correo}`, async ({ page }) => {
    test.setTimeout(90000);

    const loginPage = new LoginPage(page);
    const tesoreriaPage = new TesoreriaPage(page);

    // 1. Iniciar sesión
    await loginPage.navegar();
    await loginPage.iniciarSesion(gasto.correo, gasto.password);

    // 2. Navegar a Tesorería y abrir formulario
    await tesoreriaPage.navegarATesoreria();
    await tesoreriaPage.abrirFormularioGasto();

    // 3. Completar formulario de gasto por alimentación
    await tesoreriaPage.completarFormularioGastoAlimentacion({
      fecha: gasto.fecha,
      tipoSolicitud: gasto.tipoSolicitud,
      monto: gasto.monto,
      proyecto: gasto.proyecto,
      requerimiento: gasto.requerimiento,
      motivo: gasto.motivo,
    });

    // 4. Adjuntar comprobante y enviar
    await tesoreriaPage.subirComprobante(gasto.archivoComprobante);
    await tesoreriaPage.enviarSolicitud();
  });
}
