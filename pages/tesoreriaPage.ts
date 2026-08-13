import path from 'path';
import { fileURLToPath } from 'url';
import { Page, Locator, expect } from '@playwright/test';
import { CalendarComponent } from '@components/CalendarComponent';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '../data/assets');

export class TesoreriaPage {
  readonly page: Page;
  private calendar: CalendarComponent;

  // Labels de las opciones del combobox "Tipo de solicitud", propios del Page
  // (se respeta el ligature/ícono con el que Angular Material arma el accessible name).
  private readonly OPCION_ALIMENTACION = ' GASTO POR ALIMENTACIÓN';
  private readonly OPCION_MOVILIDAD = ' GASTO POR MOVILIDAD';
  private readonly OPCION_COCHERAS = 'garage DEVOLUCIÓN DE COCHERAS';
  private readonly OPCION_OTROS_GASTOS = 'local_atm OTROS GASTOS';

  // Navegación
  readonly menuBtn: Locator;
  readonly tesoreriaLink: Locator;
  readonly homeRegistrarSolicitudBtn: Locator;

  // Flujo "Crear" clásico (rol Colaborador / Persona)
  readonly personaRadio: Locator;
  readonly crearBtn: Locator;

  // Formulario
  readonly formularioDialog: Locator;
  readonly tipoSolicitudCombo: Locator;
  readonly montoInput: Locator;
  readonly proyectoCombo: Locator;
  readonly requerimientoCombo: Locator;
  readonly seleccionarCombo: Locator;
  readonly motivoInput: Locator;
  readonly subirArchivoBtn: Locator;
  readonly enviarBtn: Locator;
  readonly aceptarBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calendar = new CalendarComponent(page);

    this.menuBtn = page.getByRole('button', { name: 'menu' });
    this.tesoreriaLink = page.getByRole('link', { name: 'paid Tesorería' });
    this.homeRegistrarSolicitudBtn = page.getByRole('button', {
      name: 'add_circle Registrar solicitud de reembolso',
    });

    this.personaRadio = page.getByRole('radio', { name: 'person' });
    this.crearBtn = page.getByRole('button', { name: ' Crear' });

    this.formularioDialog = page.getByRole('dialog', { name: 'Registro de solicitud' });
    this.tipoSolicitudCombo = this.formularioDialog.getByRole('combobox', { name: 'Tipo de solicitud' });
    this.montoInput = this.formularioDialog.getByRole('textbox', { name: 'Ingrese el monto (Ej: 1.000,' });
    this.proyectoCombo = this.formularioDialog.getByRole('combobox', { name: 'Proyecto' });
    this.requerimientoCombo = this.formularioDialog.getByRole('combobox', { name: 'Requerimiento' });
    this.seleccionarCombo = this.formularioDialog.getByRole('combobox', { name: 'Seleccionar' });
    this.motivoInput = this.formularioDialog.getByRole('textbox', { name: 'Motivo de la solicitud' });
    this.subirArchivoBtn = this.formularioDialog.getByRole('button', { name: 'Subir archivo' });
    this.enviarBtn = this.formularioDialog.getByRole('button', { name: 'Enviar' });
    this.aceptarBtn = page.getByRole('button', { name: 'Aceptar' });
  }

  async navegarATesoreria() {
    await this.menuBtn.click();
    await this.tesoreriaLink.click();
  }

  /**
   * Entra directamente al formulario desde el card de Home
   * ("Registrar solicitud de reembolso"), sin pasar por Tesorería > Crear.
   */
  async navegarDesdeHome() {
      const btnCerrarNotificaciones = this.page.getByRole('button', {
          name: 'notifications_off Cerrar'
      });

      await btnCerrarNotificaciones
          .waitFor({ state: 'visible', timeout: 5000 })
          .then(async () => {
              await btnCerrarNotificaciones.click();
              await btnCerrarNotificaciones.waitFor({
                  state: 'hidden',
                  timeout: 5000
              });
          })
          .catch(() => {
              // No apareció la notificación
          });

      await this.homeRegistrarSolicitudBtn.click();
      await expect(this.formularioDialog).toBeVisible();
  }

  async abrirFormularioGasto() {
    try {
      // 1. Esperamos hasta 3 segundos a que el botón 'Crear' se vuelva visible (Rol: Colaborador)
      await this.crearBtn.waitFor({ state: 'visible', timeout: 3000 });
    } catch {
      // 2. Si pasan 3 segundos y no apareció, ejecutamos el clic en 'person' (Rol: Persona)
      await this.personaRadio.click();
    }

    // 3. Hacemos clic en Crear y validamos el diálogo
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
    await this.calendar.seleccionarFecha(fecha);
  }

  /**
   * Abre el combo "Seleccionar" y agrega una persona por cada elemento del
   * arreglo, tantas veces como personas se le pasen.
   */
  private async seleccionarPersonas(personas: string[]) {
    for (const persona of personas) {
      await this.seleccionarCombo.click();
      await this.seleccionarOpcion(persona);
    }
  }

  /** Llena el formulario de GASTO POR ALIMENTACIÓN */
  async llenarGastoAlimentacion(
    fecha: string,
    monto: string,
    proyecto: string,
    requerimiento: string,
    personaSeleccionada: string[],
    motivo: string,
  ) {
    await this.seleccionarFecha(fecha);
    await this.tipoSolicitudCombo.click();
    await this.seleccionarOpcion(this.OPCION_ALIMENTACION);
    await this.montoInput.fill(monto);
    await this.seleccionarOpcionFiltrable(this.proyectoCombo, proyecto);
    await this.seleccionarOpcionFiltrable(this.requerimientoCombo, requerimiento);
    await this.seleccionarPersonas(personaSeleccionada);
    await this.motivoInput.fill(motivo);
  }

  /** Llena el formulario de GASTO POR MOVILIDAD */
  async llenarGastoMovilidad(
    fecha: string,
    monto: string,
    proyecto: string,
    requerimiento: string,
    motivo: string,
  ) {
    await this.seleccionarFecha(fecha);
    await this.tipoSolicitudCombo.click();
    await this.seleccionarOpcion(this.OPCION_MOVILIDAD);
    await this.montoInput.fill(monto);
    await this.seleccionarOpcionFiltrable(this.proyectoCombo, proyecto);
    await this.seleccionarOpcionFiltrable(this.requerimientoCombo, requerimiento);
    await this.motivoInput.fill(motivo);
  }

  /** Llena el formulario de DEVOLUCIÓN DE COCHERAS (no pide proyecto/requerimiento/persona) */
  async llenarDevolucionCocheras(fecha: string, monto: string, motivo: string) {
    await this.seleccionarFecha(fecha);
    await this.tipoSolicitudCombo.click();
    await this.seleccionarOpcion(this.OPCION_COCHERAS);
    await this.montoInput.fill(monto);
    await this.motivoInput.fill(motivo);
  }

  /** Llena el formulario de OTROS GASTOS */
  async llenarOtrosGastos(
    fecha: string,
    monto: string,
    proyecto: string,
    requerimiento: string,
    personaSeleccionada: string[],
    motivo: string,
  ) {
    await this.seleccionarFecha(fecha);
    await this.tipoSolicitudCombo.click();
    await this.seleccionarOpcion(this.OPCION_OTROS_GASTOS);
    await this.montoInput.fill(monto);
    await this.seleccionarOpcionFiltrable(this.proyectoCombo, proyecto);
    await this.seleccionarOpcionFiltrable(this.requerimientoCombo, requerimiento);
    await this.seleccionarPersonas(personaSeleccionada);
    await this.motivoInput.fill(motivo);
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