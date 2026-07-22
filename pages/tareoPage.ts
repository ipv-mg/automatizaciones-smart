import { Page, Locator, expect } from '@playwright/test';

export class TareoPage {
  readonly page: Page;

  // Locators
  readonly btnRegistrarActividadInicial: Locator;
  readonly btnAgregarActividad: Locator;
  readonly inputMinutos: Locator;
  readonly inputFecha: Locator;
  readonly cboProyecto: Locator;
  readonly cboRequerimiento: Locator;
  readonly cboCategoria: Locator;
  readonly cboTipoHoras: Locator;
  readonly cboRefresh: Locator;
  readonly inputHoraInicio: Locator;
  readonly inputDescripcion: Locator;
  readonly btnRegistrarActividadesFinal: Locator;
  readonly modalConfirmacion: Locator;
  readonly btnGuardarYSalir: Locator;
  readonly modalExito: Locator;

  constructor(page: Page) {
    this.page = page;

    this.btnRegistrarActividadInicial = page.getByRole('button', { name: 'add_circle Registrar actividad' });
    this.btnAgregarActividad = page.getByRole('button', { name: /agregar actividad/i });
    this.inputMinutos = page.locator('input[placeholder="00"]');
    this.inputFecha = page.locator('input[placeholder="DD/MM/AAAA"]').first();
    this.cboProyecto = page.getByRole('combobox', { name: 'Proyecto' });
    this.cboRequerimiento = page.getByRole('combobox', { name: 'Requerimiento' });
    this.cboCategoria = page.getByRole('combobox', { name: 'Categoría' });
    this.cboTipoHoras = page.getByRole('combobox', { name: 'Tipo de Horas' });
    this.cboRefresh = page.locator('mg-input-select', { hasText: 'Tipo de Horas' }).getByRole('button');
    this.inputHoraInicio = page.getByRole('textbox', { name: '--:--' });
    this.inputDescripcion = page.getByRole('textbox', { name: 'Describir actividad' });
    this.btnRegistrarActividadesFinal = page.getByRole('button', { name: /registrar actividades/i });
    this.modalConfirmacion = page.getByRole('heading', { name: '¿Que acción desea realizar?' });
    this.btnGuardarYSalir = page.getByRole('button', { name: 'Guardar y salir' });
    this.modalExito = page.getByRole('heading', { name: '¡Procesado con éxito!' });
  }

  /**
   * Abre el modal/sección de registro
   */
  async abrirFormularioRegistro() {
    await this.btnRegistrarActividadInicial.click();
    await expect(this.btnAgregarActividad).toBeVisible();
  }

  /**
   * 🟢 MÉTODO QUE FALTABA: Inyecta la fecha directamente en el input del DOM
   */
  async setFecha(fecha: string) {
    await expect(this.inputFecha).toBeVisible();
    await this.inputFecha.evaluate((input: HTMLInputElement, valor) => {
      input.value = valor;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, fecha);
  }

  /**
   * Llena todo el formulario de tareo
   */
  /**
   * Llena todo el formulario de tareo
   */
  async llenarFormulario(item: any) {
    // 1. Minutos y Fecha
    await this.inputMinutos.fill(item.minutos);
    await this.setFecha(item.fecha);

    // 2. Selección de Proyecto
    await this.cboProyecto.click();
    const optProyecto = this.page.getByRole('option', { name: item.proyecto, exact: true });
    await optProyecto.waitFor({ state: 'visible' });
    await optProyecto.click();

    // 3. Selección de Requerimiento
    await this.cboRequerimiento.click();
    const optRequerimiento = this.page.getByRole('option', { name: item.requerimiento, exact: true });
    await optRequerimiento.waitFor({ state: 'visible' });
    await optRequerimiento.click();

    // 4. Selección de Categoría (Aquí es donde fallaba)
    await this.cboCategoria.click();
    const optCategoria = this.page.getByRole('option', { name: item.categoria, exact: true });
    await optCategoria.waitFor({ state: 'visible' });
    // Usamos { force: true } por si la animación de Angular intenta bloquear el clic
    await optCategoria.click({ force: true });

    // 5. Reset y Selección de Tipo de Horas
    await this.cboRefresh.click();
    await this.cboTipoHoras.click();
    const optTipoHora = this.page.getByRole('option', { name: item.tipo_hora, exact: true });
    await optTipoHora.waitFor({ state: 'visible' });
    await optTipoHora.click({ force: true });

    if (item.tipo_hora !== 'HORARIO REGULAR') {
      await this.inputHoraInicio.fill(item.hora);
    }

    // 6. Descripción
    await this.inputDescripcion.fill(item.descripcion);
  }

  /**
   * Agrega la actividad a la lista temporal y procesa el envío final
   */
  async guardarYEnviar() {
    await this.btnAgregarActividad.click();

    await expect(this.btnRegistrarActividadesFinal).toBeVisible({ timeout: 10000 });
    await this.btnRegistrarActividadesFinal.click();

    await expect(this.modalConfirmacion).toBeVisible();
    await this.btnGuardarYSalir.click();

    await expect(this.modalExito).toBeVisible();
  }
}