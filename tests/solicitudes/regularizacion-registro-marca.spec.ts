import { test } from '@playwright/test';
import { LoginPage, RegularizacionHorasPage } from '@pages';
import { regularizacion } from '@data/regularizacionData';

for (const solicitud of regularizacion) {
  test(`Solicitud de regularizacion de marca para ${solicitud.correo}`, async ({ page }) => {
    test.setTimeout(30000);

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
    
    // 4. Registrar solicitud y enviar
    for (const iter of solicitud.hora ){
        await regularizacionHorasPage.registrarMarca(iter, solicitud.motivo, solicitud.texto);
    }
    
    await regularizacionHorasPage.enviarSolicitud(solicitud.hora.length);
  });
}