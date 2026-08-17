import { test, expect } from '@playwright/test';
import { edicion } from '@data/tareoData';
import { LoginPage, TareoPage } from '@pages';
import { parseHoursToMinutes } from '../../utils/numberUtils';

for (const [index, item] of edicion.entries()) {
  test(`Duplicar tareo de ${item.correo}`, async ({ page }) => {
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);
    const tareoPage = new TareoPage(page);
    const minutosAntes: number[] = [];
    // 1. Iniciar Sesión
    await loginPage.navegar();
    await loginPage.iniciarSesion(item.correo, item.password);

    // 2. Va al tareo, filtra por fecha y eliminar la actividad
    await tareoPage.navegarModulo();
    await tareoPage.filtroCalendario(item.fechaInicio, item.fechaFin);
    for(const dia of item.fecha){
      await tareoPage.abrirFormularioRegistro();
      await tareoPage.filtroCalendario(dia);
      const min = await tareoPage.obtenerMinutosDisponibles()
      minutosAntes.push(min);
      await tareoPage.btnClose.first().click();
    }

    await tareoPage.duplicarTareo(item, item.id!, true);

    // 3. Validacion al día editado
    await tareoPage.abrirFormularioRegistro();
    for(const [index, dia] of item.fecha.entries()){
        await tareoPage.filtroCalendario(dia);
        const minutosOcupados = minutosAntes[index] - Number(item.minutosRegulares);
        await expect(minutosOcupados).toEqual(await tareoPage.obtenerMinutosDisponibles());
    }

  });
}