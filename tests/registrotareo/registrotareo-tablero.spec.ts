import { test, expect } from '@playwright/test';
import { tareo } from '../../data/tareoData'; // 📦 Importamos el arreglo de solicitudes desde el archivo de datos local (datos.ts)
import { LoginPage } from '@pages';
// 📦 Importamos el arreglo de solicitudes desde el archivo de datos local (datos.ts)

// Data-driven testing: Iteramos sobre cada objeto del arreglo para ejecutar el mismo flujo con diferentes datos
for (const item of tareo) {
    
    test('Registro tareo desde tablero', async ({ page }) => {
        test.setTimeout(60000);

        const loginPage = new LoginPage(page);
        
        // 1. Iniciar Sesión
        await loginPage.navegar();
        await loginPage.iniciarSesion(item.correo, item.password);

        // Ingreso a la sección de registro
        await page.getByRole('button', { name: 'add_circle Registrar actividad' }).click();

        // Espera a que el botón de agregar actividad sea visible antes de continuar
        await expect(page.getByRole('button', { name: 'add_circle   Agregar actividad' })).toBeVisible();

        /// Cambio agregado por AM
        // Localiza el campo por su placeholder '00' y llena los '15' de datos.ts
        // Agregamos .locator('input') para indicarle que queremos el campo de texto interno
        await page.getByPlaceholder('00').locator('input').clear(); // Eliminara cualquier valor previo antes de llenar el nuevo
        await page.locator('input[placeholder="00"]').fill(item.minutos); // Ingresara la cantidad de minutos del archivo datos.ts

       // Inyección directa en el DOM pasando 'item.fecha' como argumento
        const fechaInput = page.locator('input[placeholder="DD/MM/AAAA"]').first();
        await expect(fechaInput).toBeVisible();
        await fechaInput.evaluate((input: HTMLInputElement, fechaValor) => {
            input.value = fechaValor;
            // Disparamos los eventos para que la página (React/Angular/Vue) detecte el cambio de datos
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }, item.fecha); // 👈 Aquí se pasa la fecha del objeto actual (p. ej. '09/06/2026')

        // Selección del proyecto 
        await page.getByRole('combobox', { name: 'Proyecto' }).click();
        await page.getByRole('option', { name: item.proyecto, exact: true }).click();
        // Selección del requerimiento
        await page.getByRole('combobox', { name: 'Requerimiento' }).click();
        await page.getByRole('option', { name: item.requerimiento, exact: true }).click();
        // Selección de la categoria        
        await page.getByRole('combobox', { name: 'Categoría' }).click();
        await page.getByRole('option', { name: item.categoria, exact: true }).click();
        // Selección de tipo de hora
        // Evaluamos directamente el valor que viene desde datos.ts para la iteración actual
        if (item.tipo_hora === 'HORARIO REGULAR') 
        {
            // 🟢 FLUJO A: Código que se ejecuta si es "HORARIO REGULAR"
            await page.locator('mg-input-select', { hasText: 'Tipo de Horas' }).getByRole('button').click();
            await page.getByRole('combobox', { name: 'Tipo de Horas' }).click();
            await page.getByRole('option', { name: 'HORARIO REGULAR', exact: true }).click();
        }
        else 
        {
            // 🟡 FLUJO B: Código que se ejecuta para CUALQUIER OTRO tipo de hora (ej: "HORAS EXTRAS", etc.)
            await page.locator('mg-input-select', { hasText: 'Tipo de Horas' }).getByRole('button').click();
            await page.getByRole('combobox', { name: 'Tipo de Horas' }).click();
            await page.getByRole('option', { name: item.tipo_hora, exact: true }).click();
            await page.getByRole('textbox', { name: '--:--' }).fill(item.hora);
        }
        // Llenado de la descripción de la actividad
        await page.getByRole('textbox', { name: 'Describir actividad' }).fill(item.descripcion);


        // Clikear en el botón de agregar actividad
        await page.getByRole('button', { name: 'add_circle   Agregar actividad' }).click();
        await expect(page.getByRole('button', { name: 'Registrar actividades' })).toBeVisible();
        await page.getByRole('button', { name: 'Registrar actividades' }).click();
        // Validar que se agregue la actividad(confirmar o cancelar)
        await expect(page.getByRole('heading', { name: '¿Que acción desea realizar?' })).toBeVisible();
        // Click en el botón de "Guardar y salir" para finalizar el registro
        await page.getByRole('button', { name: 'Guardar y salir' }).click();
        // Validación de que la actividad se registró correctamente(se debe mostrar un modal de confirmación)
        await expect(page.getByRole('heading', { name: '¡Procesado con éxito!' })).toBeVisible();
    });
}