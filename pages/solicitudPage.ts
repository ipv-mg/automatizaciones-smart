import path from 'path';
import { fileURLToPath } from 'url';
import { Page, Locator, expect } from '@playwright/test';
import { CalendarComponent } from '@components';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '../data/assets');
export class SolicitudPage {
  readonly page: Page;
  readonly calendar: CalendarComponent;

  // Modales y Controles Generales
  readonly registrarSolicitudBtn: Locator;
  readonly tipoSolicitudCombo: Locator;
  readonly btnCerrarModal: Locator;
  readonly aceptarBtn: Locator;
  readonly enviarBtn: Locator;

  // Formulario - Selección de Colaborador y Responsables
  readonly comboColaborador: Locator;
  readonly responsablesCombo: Locator;

  // Formulario - Horas y Tiempos
  readonly horaInput: Locator;
  readonly cantidadCombo: Locator;
  readonly alertaRangoPermitido: Locator;

  // Formulario - Motivos y Archivos
  readonly motivoCombo: Locator;
  readonly descripcionInput: Locator;
  readonly fileInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calendar = new CalendarComponent(page);
    // Botones y Selectores base
    this.registrarSolicitudBtn = page.getByRole('button', { name: 'add_circle Registrar solicitud', exact: true });
    this.tipoSolicitudCombo = page.getByRole('combobox', { name: 'Tipo de solicitud' });
    this.btnCerrarModal = page.getByRole('button', { name: 'close' });
    this.aceptarBtn = page.getByRole('button', { name: 'Aceptar' });
    this.enviarBtn = page.getByRole('button', { name: 'Enviar' });

    // Colaborador y Responsable
    this.comboColaborador = page.getByRole('combobox', { name: 'Seleccione un colaborador' });
    this.responsablesCombo = page.getByRole('combobox', { name: 'Responsables de las' });

    // Horas y Cantidad
    this.horaInput = page.getByRole('textbox', { name: '--:--' });
    this.cantidadCombo = page.getByRole('combobox', { name: 'Cantidad' });
    this.alertaRangoPermitido = page.getByText('* Horas dentro de un rango no permitido');

    // Motivos y Adjuntos
    this.motivoCombo = page.getByRole('combobox', { name: 'Seleccione un motivo' });
    this.descripcionInput = page.getByRole('textbox', { name: 'Ingrese el motivo de su' });
    this.fileInput = page.locator('input[type="file"]');
  }

  /**
   * Abre el modal de creación y selecciona el tipo de solicitud.
   */
  async abrirFormulario(tipoSolicitud: string): Promise<void> {
    await this.registrarSolicitudBtn.click();
    await expect(this.tipoSolicitudCombo).toBeEnabled();
    await this.tipoSolicitudCombo.click();
    await this.page.getByRole('option', { name: tipoSolicitud }).click();
  }

  /**
   * Aplica el filtro radio "TODOS" y cierra el modal auxiliar si aplica (flujo por días)
   */
  async aplicarFiltroTodos(filtro: string): Promise<void> {
    const btnRadioTodos = this.page.getByRole('radio', { name: filtro })
    if (await btnRadioTodos.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btnRadioTodos.click();
      if (await this.btnCerrarModal.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.btnCerrarModal.click();
      }
    }
  }

  /**
   * Selecciona un colaborador cuando el usuario actual actúa como administrador/aprobador.
   */
  async seleccionarColaborador(nombreCompleto: string): Promise<void> {
    if (await this.comboColaborador.isVisible({ timeout: 2000 }).catch(() => false)) {
      const palabras = nombreCompleto.split(' ');
      const patronBusqueda = palabras[0]; // Extrae el primer nombre/apellido para buscar
      await this.comboColaborador.fill(patronBusqueda);
      await this.page.getByRole('option', { name: nombreCompleto }).click();
      await this.comboColaborador.click({ timeout: 3000 });
    }
  }

  /**
   * Completa la fecha, hora e intervalo para solicitudes por horas.
   */
  async completarDetallesHoras(fecha: string, hora: string, cantidad: string): Promise<void> {
    await this.calendar.seleccionarFecha(fecha);
    await this.horaInput.fill(hora);
    await this.cantidadCombo.click();
    await this.page.getByRole('option', { name: cantidad, exact: true }).click();
  }

  /**
   * Completa fecha y cantidad para solicitudes por días.
   */
  async completarDetallesDias(fecha: string, cantidad: string): Promise<void> {
    await this.calendar.seleccionarFecha(fecha);
    if (await this.cantidadCombo.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.cantidadCombo.click();
      await this.page.getByRole('option', { name: cantidad }).click();
    }
  }

  /**
   * Verifica si salta la alerta de horario no permitido o duplicado.
   */
  async esRangoNoPermitido(): Promise<boolean> {
    await this.responsablesCombo.click();
    return await this.alertaRangoPermitido.isVisible({ timeout: 2000 }).catch(() => false);
  }

  /**
   * Selecciona responsable, motivo general y llena el campo descriptivo/detalle.
   */
  async seleccionarResponsableYMotivo(responsable: string, motivo: string, descripcion: string): Promise<void> {
    // Si el combo requiere interacción o filtrado previo
    if (await this.responsablesCombo.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.responsablesCombo.click();
      const responsableOption = this.page.getByRole('option', { name: responsable });
      
      if (await responsableOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await responsableOption.click();
      } else {
        // En caso de necesitar escribir para filtrar el autocomplete
        const primerNombre = responsable.split(' ')[0];
        await this.responsablesCombo.fill(primerNombre);
        await this.page.getByRole('option', { name: responsable }).click();
      }
    }

    await this.motivoCombo.click();
    await this.page.getByRole('option', { name: motivo }).click();
    await this.descripcionInput.fill(descripcion);
  }

  /**
   * Sube un archivo almacenado en @data/assets/ de forma cross-platform.
   */
  async subirComprobante(nombreArchivo: string) {
    const rutaArchivo = path.join(assetsDir, nombreArchivo);
    await this.fileInput.setInputFiles(rutaArchivo);
  }
  /**
   * Confirma el envío del formulario.
   */
  async enviarSolicitud() {
    await this.enviarBtn.click();
    await expect(this.aceptarBtn).toBeVisible();
    await this.aceptarBtn.click();
  }
}