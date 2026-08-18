// tests/permiso-solicitudes.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage, SolicitudPage } from '@pages';
import { solicitudes } from '@data/solicitudesData';
import { TipoSolicitud } from '@data/solicitudesData'; 

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
    await solicitudPage.abrirFormulario(solicitud.tipoSolicitud);

    switch(solicitud.tipoSolicitud){
      case TipoSolicitud.DIAS: 
        await solicitudPage.seleccionarColaborador(solicitud.colaboradorNombre);
        await solicitudPage.completarDetallesDias(solicitud.fecha, solicitud.cantidadDias!);
        await solicitudPage.seleccionarResponsableYMotivo(solicitud.responsable,solicitud.motivo, solicitud.descripcion);
        if(solicitud.archivoAdjunto){
          await solicitudPage.subirComprobante(solicitud.archivoAdjunto);
        }
        break;
      case TipoSolicitud.HORAS: 
        await solicitudPage.completarDetallesHoras(solicitud.fecha,solicitud.hora,solicitud.cantidadHoras!);
        // Validación de duplicados/rango: solo aplica a horas
        await expect(await solicitudPage.esRangoNoPermitido()).toBe(false);
        await solicitudPage.seleccionarResponsableYMotivo(solicitud.responsable,solicitud.motivo, solicitud.descripcion);
        break; 
    }

    // 3. Enviar (común)
    await solicitudPage.enviarSolicitud();
  });
}