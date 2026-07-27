import { Browser } from '@playwright/test';
import { MarcasService } from '@services/marcasService';
import { UsuarioMarca } from '@data/marcasData';

export class CrearMarcasFlow {

  constructor(
    private readonly browser: Browser,
    private readonly marcasService: MarcasService
  ) {}


  async ejecutar(usuario: UsuarioMarca) {

    const context = await this.browser.newContext();
    const page = await context.newPage();

    let token = '';

    const listener = (req: any) => {

      const authHeader =
        req.headers()['authorization'] ||
        req.headers()['Authorization'];

      if (
        authHeader &&
        authHeader.toLowerCase().startsWith('bearer ')
      ) {
        token = authHeader.replace(/^Bearer\s+/i, '').trim();
      }
    };


    page.on('request', listener);


    try {

      await page.goto(
        'https://qa.appsmart.pe/auth/login'
      );


      await page
        .getByRole('textbox',
          {
            name: 'Escribe tu correo electrónico'
          }
        )
        .fill(usuario.correo);


      await page
        .getByRole('textbox',
          {
            name: 'Escribe tu contraseña'
          }
        )
        .fill(usuario.password ?? '');


      await page
        .getByRole('button',
          {
            name: 'INGRESAR'
          }
        )
        .click();


      let intentos = 0;

      while (!token && intentos < 20) {

        await page.waitForTimeout(500);
        intentos++;

      }


      if (!token) {
        throw new Error(
          `No se obtuvo token para ${usuario.correo}`
        );
      }


      for (const tiempo of usuario.dTiempo_Marca) {

        await this.marcasService.crearMarca(
          token,
          {
            nId_Usuario: usuario.nid_usuario,
            dFecha_Jornada: usuario.dFecha_Jornada,
            dTiempo_Marca: tiempo,
            nTypeInterval: 1,
            sJustificacion:
              'PRUEBA AUTOMATIZADA PW API',
            bAcepta_Marca_Fuera_De_Tiempo: false,
            deviceInfo: {
              nMethod: usuario.nMethod,
              sBrowser: 'Biometrico',
              sUid: 'ZXRC23012060',
              sOS: 'X11; Linux x86_64',
              nWidth: 800,
              nHeight: 600,
              bEmulated: 0
            }
          }
        );


        await page.waitForTimeout(5000);

      }


    } finally {

      await context.close();

    }

  }
}