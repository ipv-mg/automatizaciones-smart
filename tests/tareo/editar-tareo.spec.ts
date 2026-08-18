import { test } from '@playwright/test';
import { edicion } from '@data/tareoData';
import { LoginPage, TareoPage } from '@pages';

for (const item of edicion) {
  test(`Editar tareo - ${item.proyecto}`, async ({ page }) => {
    test.setTimeout(120000);

    const loginPage = new LoginPage(page);
    const tareoPage = new TareoPage(page);

    // 1. Iniciar Sesión
    await loginPage.navegar();
    await loginPage.iniciarSesion(item.correo, item.password);

    // 2. navegar al modulo y filtrar
    await tareoPage.navegarModulo();
    await tareoPage.filtroCalendario(item.fechaInicio, item.fechaFin);
    // 3. LLenar formulario
    await tareoPage.editarTareo(item.fecha, item);

  });
}