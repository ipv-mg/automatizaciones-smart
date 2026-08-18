// tests/permiso-solicitudes.spec.ts
import { test } from '@playwright/test';
import { LoginPage, SolicitudPage } from '@pages';
import { solicitudes } from '@data/solicitudesData';

const TIPO_DIAS = 'PERMISO POR DÍAS';

for (const solicitud of solicitudes) {
  const esPorDias = solicitud.tipoSolicitud === TIPO_DIAS;
  const titulo = esPorDias
    ? `Solicitud de permiso por días para ${solicitud.correo}`
    : `Solicitud de permiso por horas para ${solicitud.correo}`;

  test(titulo, async ({ page }) => {
    test.setTimeout(60000);
    const loginPage = new LoginPage(page);
    const solicitudPage = new SolicitudPage(page);

    // 1. Iniciar sesión (común)
    await loginPage.navegar();
    await loginPage.iniciarSesion(solicitud.correo, solicitud.password);

    // 2. Abrir formulario (común)
    await solicitudPage.abrirFormulario(solicitud.filtroRadio, solicitud.tipoSolicitud);

    if (esPorDias) {
      // --- Flujo exclusivo de DÍAS ---
      if (solicitud.colaboradorNombre) {
        await solicitudPage.seleccionarColaborador(solicitud.colaboradorNombre);
      }
      await solicitudPage.completarDetallesDias(solicitud.fecha, solicitud.cantidadDias);
    } else {
      // --- Flujo exclusivo de HORAS ---
      await solicitudPage.completarDetallesHoras(
        solicitud.fecha,
        solicitud.hora,
        solicitud.cantidad 
      );

      // Validación de duplicados/rango: solo aplica a horas
      if (await solicitudPage.esRangoNoPermitido()) {
        console.log(`El permiso para ${solicitud.correo} ya existe o está fuera del rango.`);
        test.skip();
      }
    }

    // 3. Responsable y motivo (común, con detalle distinto según tipo)
    await solicitudPage.seleccionarResponsableYMotivo(
      solicitud.responsable,
      solicitud.motivo,
      esPorDias ? (solicitud.motivoDetalle || solicitud.descripcion) : solicitud.descripcion
    );

    // 4. Adjunto: solo aplica a días
    if (esPorDias && solicitud.archivoAdjunto) {
      await solicitudPage.subirComprobante(solicitud.archivoAdjunto);
    }

    // 5. Enviar (común)
    await solicitudPage.enviarSolicitud();
  });
}