import { test } from '@playwright/test';
import { LoginPage, RegularizacionHorasPage } from '@pages';
import { regularizacion } from '@data/regularizacionData';

for (const solicitud of regularizacion) {
  test(`Solicitud de regularizacion de marca para ${solicitud.correo}`, async ({ page }) => {
    test.setTimeout(60000);

    // Inicializamos las páginas POM
    const loginPage = new LoginPage(page);
    const regularizacionHorasPage = new RegularizacionHorasPage(page);

    // 1. Iniciar Sesión
    await loginPage.navegar();
    await loginPage.iniciarSesion(solicitud.correo, solicitud.password);

    // 2. Abrir modal de regularizacion de marca
    await regularizacionHorasPage.abrirModal();

    // 3. Seleccionar fecha y habilitar formularios de solicitud
    await regularizacionHorasPage.seleccionarFecha(solicitud.fecha);
    await regularizacionHorasPage.abrirPanelDerecho(); 
    
    // 4. Accion de solicitud y enviar
    switch (solicitud.tipo) {
      case "REGISTRAR":
        await regularizacionHorasPage.registrarMarca(solicitud.horaNueva, solicitud.motivo, solicitud.texto);
        await regularizacionHorasPage.enviarSolicitud(solicitud.horaNueva.length);
        break;
      case "EDITAR":
        await regularizacionHorasPage.editarMarca(solicitud.horaActual, solicitud.horaNueva, solicitud.motivo, solicitud.texto);
        await regularizacionHorasPage.enviarSolicitud(solicitud.horaNueva.length);
        break;
      case "ELIMINAR":
        await regularizacionHorasPage.eliminarMarca(solicitud.horaEliminar, solicitud.motivo, solicitud.texto);
        await regularizacionHorasPage.enviarSolicitud(solicitud.horaEliminar.length);
        break;
    }
  });
}