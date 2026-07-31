import { test } from '@playwright/test';
import { tareo } from '@data/tareoData';
import { LoginPage, TareoPage } from '@pages';

for (const item of tareo) {
  test(`Registro tareo desde tablero - ${item.proyecto}`, async ({ page }) => {
    test.setTimeout(60000);

    const loginPage = new LoginPage(page);
    const tareoPage = new TareoPage(page);

    // 1. Iniciar Sesión
    await loginPage.navegar();
    await loginPage.iniciarSesion(item.correo, item.password);

    // 2. Path de referencia
    switch(item.path){
      case 1: { await tareoPage.abrirFormularioRegistro(); break; }//registro desde card
      case 2: { await tareoPage.abrirFormularioRegistroDesdeModulo(); break; }//registro desde modulo tareo
      default: { throw new Error('No se ha indicado un flujo válido' ); } 
    }

    // 3. LLenar formulario
    await tareoPage.llenarFormulario(item);
    await tareoPage.guardarYEnviar();

  });
}