import { Page, Locator, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const origin = process.env.ORIGIN || '';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly ingresarBtn: Locator;
  readonly modalAceptarBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Escribe tu correo electrónico' });
    this.passwordInput = page.getByRole('textbox', { name: 'Escribe tu contraseña' });
    this.ingresarBtn = page.getByRole('button', { name: 'INGRESAR' });
    this.modalAceptarBtn = page.locator('#cdk-dialog-1').getByRole('button', { name: 'Aceptar' });
  }

  async navegar() {
    await this.page.goto(origin);
  }

  async iniciarSesion(correo: string, pass: string) {
    await this.emailInput.fill(correo);
    await this.passwordInput.fill(pass);
    await this.ingresarBtn.click();
    
  }
}