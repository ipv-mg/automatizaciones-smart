import { test } from '@playwright/test';
import { MarcasService } from '@services/marcasServices';
import { usuarios } from '@data/marcasData';

test('Automatización: Creación de marcas masivas en paralelo', async ({ browser, request }) => {
  const marcasService = new MarcasService(request);

  // Ejecutamos la tarea de cada usuario al mismo tiempo de forma paralela
  await Promise.all(
    usuarios.map(async (usuarioTest) => {
      // 1. Cada usuario abre una sesión/contexto completamente aislado de Chrome
      const context = await browser.newContext();
      const page = await context.newPage();

      let tokenInterceptado = '';

      // Escuchador exclusivo del token para este contexto
      const requestListener = (req: any) => {
        const authHeader = req.headers()['authorization'] || req.headers()['Authorization'];
        if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
          tokenInterceptado = authHeader.replace(/^Bearer\s+/i, '').trim();
        }
      };

      page.on('request', requestListener);

      try {
        // 2. Login UI aislado por usuario
        await page.goto('https://qa.appsmart.pe/auth/login');
        await page.getByRole('textbox', { name: 'Escribe tu correo electrónico' }).fill(usuarioTest.email);
        await page.getByRole('textbox', { name: 'Escribe tu contraseña' }).fill(usuarioTest.password || '');
        await page.getByRole('button', { name: 'INGRESAR' }).click();

        // 3. Esperar token en el contexto de este usuario
        let intentos = 0;
        while (!tokenInterceptado && intentos < 20) {
          await page.waitForTimeout(500);
          intentos++;
        }

        if (!tokenInterceptado) {
          throw new Error('No se capturó el token Bearer tras el login.');
        }

        console.log(`\nProcesando: ${usuarioTest.email} (${usuarioTest.dTiempo_Marca.length} marcas)`);

        // 4. Iterar sobre las marcas de este usuario en específico
        for (let i = 0; i < usuarioTest.dTiempo_Marca.length; i++) {
          const tiempoActual = usuarioTest.dTiempo_Marca[i];

          const payload = {
            nId_Usuario: usuarioTest.nid_usuario,
            dFecha_Jornada: usuarioTest.dFecha_Jornada,
            dTiempo_Marca: tiempoActual,
            nTypeInterval: 1,
            sJustificacion: 'PRUEBA AUTOMATIZADA PW API',
            bAcepta_Marca_Fuera_De_Tiempo: false,
            deviceInfo: {
              nMethod: usuarioTest.nMethod,
              sBrowser: 'Biometrico',
              sUid: 'ZXRC23012060',
              sOS: 'X11; Linux x86_64',
              nWidth: 800,
              nHeight: 600,
              bEmulated: 0
            }
          };

          const response = await marcasService.crearMarca(tokenInterceptado, payload);
          const responseBody = await response.json();

          if (response.status() === 200 && responseBody.isSuccess) {
            console.log(`  [✓] ${usuarioTest.email} | Marca [${i + 1}/${usuarioTest.dTiempo_Marca.length}] -> ${tiempoActual}`);
          } else {
            console.log(`  [✗] ${usuarioTest.email} | Marca [${i + 1}/${usuarioTest.dTiempo_Marca.length}] falló -> ${responseBody.message || 'Error API'}`);
          }

          // Intervalo de 5 segundos entre las marcas del mismo usuario
          if (i < usuarioTest.dTiempo_Marca.length - 1) {
            await page.waitForTimeout(5000);
          }
        }

      } catch (error: any) {
        console.log(`[✗] Error en sesión/procesamiento para: ${usuarioTest.email} -> ${error.message}`);
      } finally {
        // Cierre del contexto individual (elimina cookies/sesión de este usuario)
        await context.close();
      }
    })
  );

});