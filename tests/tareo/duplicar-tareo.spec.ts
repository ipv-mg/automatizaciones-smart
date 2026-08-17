import { test } from '@playwright/test';
import { edicion } from '@data/tareoData';
import { LoginPage, TareoPage } from '@pages';

for (const [index, item] of edicion.entries()) {
  test(`Clonar tareo de ${item.correo}`, async ({ page }) => {
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);
    const tareoPage = new TareoPage(page);
    // 1. Iniciar Sesión
    await loginPage.navegar();
    await loginPage.iniciarSesion(item.correo, item.password);

    // 2. Va al tareo, filtra por fecha y eliminar la actividad
    await tareoPage.navegarModulo();
    await tareoPage.filtroCalendario(item.fechaInicio, item.fechaFin);
    await tareoPage.duplicarTareo(item, item.id!, true);
  });
}