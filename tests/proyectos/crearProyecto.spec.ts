import { test, expect } from '@playwright/test';
import { ProjectsPage, LoginPage } from '@pages';
import { projectsData } from '@data/projectsData';

test.describe('Módulo de Proyectos y Servicios', () => {
  test('Debe crear un nuevo proyecto exitosamente', async ({ page }) => {
    test.setTimeout(60000);

    const projectsPage = new ProjectsPage(page);
    const loginPage= new LoginPage(page);

    // 1. Iniciar Sesión
    await loginPage.navegar();
    await loginPage.iniciarSesion(projectsData.correo, projectsData.password);
    //
    await projectsPage.irAProyectos();
    await projectsPage.crearProyecto(projectsData);

  });
});

