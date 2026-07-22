import path from 'path';
import { fileURLToPath } from 'url';
import { Page, Locator, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '../data/assets');

export class TesoreriaPage {
  readonly page: Page;
  readonly menuBtn: Locator;
  readonly tesoreriaLink: Locator;
  readonly personaRadio: Locator;
  readonly crearBtn: Locator;
  readonly formularioDialog: Locator;
  readonly tipoSolicitudCombo: Locator;
  readonly montoInput: Locator;
  readonly proyectoCombo: Locator;
  readonly requerimientoCombo: Locator;
  readonly motivoInput: Locator;
  readonly subirArchivoBtn: Locator;
  readonly enviarBtn: Locator;
  readonly aceptarBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuBtn = page.getByRole('button', { name: 'menu' });
    this.tesoreriaLink = page.getByRole('link', { name: 'paid Tesorería' });
    this.personaRadio = page.getByRole('radio', { name: 'person' });
    this.crearBtn = page.getByRole('button', { name: ' Crear' });
    this.formularioDialog = page.getByRole('dialog', { name: 'Registro de solicitud' });
    this.tipoSolicitudCombo = this.formularioDialog.getByRole('combobox', { name: 'Tipo de solicitud' });
    this.montoInput = this.formularioDialog.getByRole('textbox', { name: 'Ingrese el monto (Ej: 1.000,' });
    this.proyectoCombo = this.formularioDialog.getByRole('combobox', { name: 'Proyecto' });
    this.requerimientoCombo = this.formularioDialog.getByRole('combobox', { name: 'Requerimiento' });
    this.motivoInput = this.formularioDialog.getByRole('textbox', { name: 'Motivo de la solicitud' });
    this.subirArchivoBtn = this.formularioDialog.getByRole('button', { name: 'Subir archivo' });
    this.enviarBtn = this.formularioDialog.getByRole('button', { name: 'Enviar' });
    this.aceptarBtn = page.getByRole('button', { name: 'Aceptar' });
  }

  async navegarATesoreria() {
    await this.menuBtn.click();
    await this.tesoreriaLink.click();
  }

  async abrirFormularioGasto() {
    await this.personaRadio.click();
    await this.crearBtn.click();
    await expect(this.formularioDialog).toBeVisible();
  }

  private async seleccionarOpcion(nombre: string) {
    const option = this.page.getByRole('option', { name: nombre });
    await expect(option).toBeVisible();
    await option.click();
  }

  private async seleccionarOpcionFiltrable(combo: Locator, nombre: string) {
    await combo.click();
    const panel = this.page.locator('.cdk-overlay-pane').last();
    await expect(panel).toBeVisible();

    const filtro = nombre.split(' ')[0];
    await combo.pressSequentially(filtro, { delay: 50 });

    const option = panel.getByRole('option', { name: nombre });
    await expect(option).toBeVisible();
    await option.click();
  }

  async seleccionarFecha(fecha: string) {
    await this.formularioDialog.getByRole('button', { name: 'Open calendar' }).click();
    const calendarioDialog = this.page.getByRole('dialog').filter({
      has: this.page.getByRole('button', { name: 'Close calendar' }),
    });
    await calendarioDialog.getByRole('button', { name: fecha, exact: true }).click();
  }

  async completarFormularioGastoAlimentacion(datos: {
    fecha: string;
    tipoSolicitud: string;
    monto: string;
    proyecto: string;
    requerimiento: string;
    motivo: string;
  }) {
    await this.seleccionarFecha(datos.fecha);

    await this.tipoSolicitudCombo.click();
    await this.seleccionarOpcion(datos.tipoSolicitud);

    await this.montoInput.fill(datos.monto);

    await this.seleccionarOpcionFiltrable(this.proyectoCombo, datos.proyecto);

    await this.seleccionarOpcionFiltrable(this.requerimientoCombo, datos.requerimiento);

    await this.motivoInput.fill(datos.motivo);
  }

  async subirComprobante(nombreArchivo: string) {
    await this.subirArchivoBtn.click();
    const rutaArchivo = path.join(assetsDir, nombreArchivo);
    await this.formularioDialog.locator('input[type="file"]').setInputFiles(rutaArchivo);
  }

  async enviarSolicitud() {
    await this.enviarBtn.click();
    await expect(this.aceptarBtn).toBeVisible();
    await this.aceptarBtn.click();
  }
}
