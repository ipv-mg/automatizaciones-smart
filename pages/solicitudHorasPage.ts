import { Page, Locator, expect } from '@playwright/test';

export class SolicitudHorasPage {
  readonly page: Page;
  readonly registrarSolicitudBtn: Locator;
  readonly tipoSolicitudCombo: Locator;
  readonly permisoHorasOption: Locator;
  readonly horaInput: Locator;
  readonly cantidadCombo: Locator;
  readonly responsablesCombo: Locator;
  readonly alertaRangoPermitido: Locator;
  readonly motivoCombo: Locator;
  readonly descripcionInput: Locator;
  readonly enviarBtn: Locator;
  readonly aceptarBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registrarSolicitudBtn = page.getByRole('button', { name: 'add_circle Registrar solicitud', exact: true });
    this.tipoSolicitudCombo = page.getByRole('combobox', { name: 'Tipo de solicitud' });
    this.permisoHorasOption = page.getByRole('option', { name: 'PERMISO POR HORAS' });
    this.horaInput = page.getByRole('textbox', { name: '--:--' });
    this.cantidadCombo = page.getByRole('combobox', { name: 'Cantidad' });
    this.responsablesCombo = page.getByRole('combobox', { name: 'Responsables de las' });
    this.alertaRangoPermitido = page.getByText('* Horas dentro de un rango no permitido');
    this.motivoCombo = page.getByRole('combobox', { name: 'Seleccione un motivo' });
    this.descripcionInput = page.getByRole('textbox', { name: 'Ingrese el motivo de su' });
    this.enviarBtn = page.getByRole('button', { name: 'Enviar' });
    this.aceptarBtn = page.getByRole('button', { name: 'Aceptar' });
  }

  async abrirFormulario() {
    // Si aparece un botón global de Aceptar antes del formulario, lo presiona
    if (await this.aceptarBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.aceptarBtn.click();
    }
    await this.registrarSolicitudBtn.click();
    await this.tipoSolicitudCombo.click();
    await this.permisoHorasOption.click();
  }

  async completarDetallesHoras(fecha: string, hora: string, cantidad: string) {
    await this.page.getByRole('button', { name: fecha }).click();
    await this.horaInput.fill(hora);
    await this.cantidadCombo.click();
    await this.page.getByRole('option', { name: cantidad, exact: true }).click();
  }

  async esRangoNoPermitido(): Promise<boolean> {
    await this.responsablesCombo.click();
    return await this.alertaRangoPermitido.isVisible({ timeout: 2000 }).catch(() => false);
  }

  async seleccionarResponsableYMotivo(responsable: string, motivo: string, descripcion: string) {
    const responsableOption = this.page.getByRole('option', { name: responsable, exact: true });
    await expect(responsableOption).toBeVisible();
    await responsableOption.click();

    await this.motivoCombo.click();
    await this.page.getByRole('option', { name: motivo, exact: true }).click();
    await this.descripcionInput.fill(descripcion);
  }

  async enviarSolicitud() {
    await this.enviarBtn.click();
    await expect(this.aceptarBtn).toBeVisible();
    await this.aceptarBtn.click();
  }
}