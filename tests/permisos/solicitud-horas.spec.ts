import { test } from '@playwright/test';
import { LoginPage, SolicitudHorasPage } from '@pages';
import { solicitudes } from '../../data/solicitudesData';

for (const solicitud of solicitudes) {
  test(`Solicitud de permiso para ${solicitud.correo}`, async ({ page }) => {
    test.setTimeout(60000);

    // Inicializamos las páginas POM
    const loginPage = new LoginPage(page);
    const solicitudPage = new SolicitudHorasPage(page);

    // 1. Iniciar Sesión
    await loginPage.navegar();
    await loginPage.iniciarSesion(solicitud.correo, solicitud.password);

    // 2. Abrir formulario e ingresar horas
    await solicitudPage.abrirFormulario();
    await solicitudPage.completarDetallesHoras(solicitud.fecha, solicitud.hora, solicitud.cantidad);

    // 3. Validar duplicados / rango no permitido
    if (await solicitudPage.esRangoNoPermitido()) {
      console.log(`El permiso para ${solicitud.correo} ya existe o está fuera del rango.`);
      test.skip();
    }

    // 4. Completar datos finales y enviar
    await solicitudPage.seleccionarResponsableYMotivo(
      solicitud.responsable,
      solicitud.motivo,
      solicitud.descripcion
    );
    
    await solicitudPage.enviarSolicitud();
  });
}