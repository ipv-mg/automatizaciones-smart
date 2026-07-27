import { Page } from '@playwright/test';

export class AuthService {

  async capturarToken(page: Page): Promise<string> {

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

    let intentos = 0;

    while (!token && intentos < 20) {
      await page.waitForTimeout(500);
      intentos++;
    }

    page.off('request', listener);

    if (!token) {
      throw new Error(
        'No se pudo capturar el token Bearer'
      );
    }

    return token;
  }
}