import { test } from '@playwright/test';
import { tareo } from '@data/tareoData';
import { LoginPage, TareoPage } from '@pages';

for (const [index, item] of tareo.entries()) {
  test(`Registro tareo desde tablero - ${item.proyecto} - ${index + 1}`, async ({ page }) => {
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);
    const tareoPage = new TareoPage(page);

    // 1. Iniciar Sesión
    await loginPage.navegar();
    await loginPage.iniciarSesion(item.correo, item.password);

    // 2. Path de referencia
    await tareoPage.abrirFormularioRegistro(); //registro desde card

    // 3. LLenar formulario
    await tareoPage.llenarFormulario(item);
    await tareoPage.guardarYEnviar();
  });
}