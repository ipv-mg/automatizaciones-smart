import { Page, Locator, expect } from '@playwright/test';
import { CalendarComponent } from '@components';
import { TareoEliminado } from '@data/tareoData';

export class TareoPage {
  readonly page: Page;
  private calendar: CalendarComponent;

  // Locators
  readonly btnRegistrarActividadInicial: Locator;
  readonly btnAgregarActividad: Locator;
  readonly inputMinutos: Locator;
  readonly inputFecha: Locator;
  readonly lblTiempoDisponible: Locator;
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
  readonly btnMenuIzquierdo: Locator;
  readonly btnModuloTareo: Locator;
  readonly btnAceptar: Locator;
  readonly btnCancelar: Locator;
  readonly btnClose: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calendar = new CalendarComponent(page);

    this.btnRegistrarActividadInicial = page.locator('button').filter({ hasText: /registrar actividad/i });
    this.btnAgregarActividad = page.getByRole('button', { name: /agregar actividad/i });
    this.inputMinutos = page.locator('input[placeholder="00"]');
    this.inputFecha = page.locator('input[placeholder="DD/MM/AAAA"]').first();
    this.lblTiempoDisponible = page.getByText(/^Disp\./);
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
    this.btnAceptar = page.getByRole('button', { name: 'Aceptar' });
    this.btnCancelar = page.getByRole('button', { name: 'Cancelar' });
    this.btnClose = page.getByRole('button', { name: 'close' });
    // pasos para ir al módulo
    this.btnMenuIzquierdo = page.getByRole('button', { name: 'menu' });
    this.btnModuloTareo = page.getByRole('link', { name: 'task Tareo' });
  }

  /**
   * Funcion para abrir el formulario desde home o modulo
   */
  async abrirFormularioRegistro() {
    await this.btnRegistrarActividadInicial.click();
    await expect(this.btnAgregarActividad).toBeVisible();
  }

  /**
   * Consume el componente calendario y setea la fecha en el formulario
   * @param fecha 
   */
  async setFecha(fecha: string) {
    await expect(this.inputFecha).toBeVisible();
    await this.inputFecha.click();
    await this.calendar.seleccionarFecha(fecha);
  }

  /**
   * Llena el tipo de hora y tolera el refresh al hacer el cambio
   * @param tipoHora 
   */
  async setTipoHora(tipoHora: string) {
    await this.cboRefresh.click();
    await this.cboTipoHoras.click();
    const optTipoHora = this.page.getByRole('option', { name: tipoHora, exact: true });
    await optTipoHora.waitFor({ state: 'visible' });
    await optTipoHora.click({ force: true });

  }

  /**
   * Llena los minutos de actividad y valida que sea un ingreso válido
   * @minutos
   */
  async llenarMinutos(hora: string){
    await expect(Number(hora)).toBeLessThanOrEqual(await this.obtenerMinutosDisponibles());
    await this.inputMinutos.fill(hora);
  }

  /**
   * Funcion principal para llenar el formulario de tareo
   * @param item encapsula todos los atributos a usar para el formulario
   */
  async llenarFormulario(fecha: string, item: any) {
    // 1. Minutos y Fecha
    await this.setFecha(fecha);
    await this.llenarMinutos(item.minutosRegulares);

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
    await this.setTipoHora(item.tipoHora);

    if (item.tipoHora !== 'HORARIO REGULAR') {
      await this.inputHoraInicio.fill(item.hora);
    }

    // 6. Descripción
    await this.inputDescripcion.fill(item.descripcion);
  }

  /**
   * Crud de tareos: Registrar, Editar, Eliminar, Clonar
   * @id para las transacciones excepto registrar, se busca en el listado y se filtra por ID
   */
  async guardarYEnviar() {
    await this.btnAgregarActividad.click();

    await expect(this.btnRegistrarActividadesFinal).toBeVisible({ timeout: 10000 });
    await this.btnRegistrarActividadesFinal.click();

    await expect(this.modalConfirmacion).toBeVisible();
    await this.btnGuardarYSalir.click();

    await expect(this.modalExito).toBeVisible();
    await this.btnAceptar.click();
  }

  async eliminarTareo(id: number[]): Promise<TareoEliminado[]> {
    const datosEliminados: TareoEliminado[] = [];
    
    for(const id_ of id){
      const fila = this.recuperarFila(id_);
      // Se recupera la fecha y hora para validaciones
      datosEliminados.push(await this.recuperarFechaYHora(fila));
      // Se elimina el tareo
      await fila
          .locator('td.cdk-column-icEliminarTarea')
          .locator('div.cursor-pointer')
          .click();
      await this.aceptar();
    }
    return datosEliminados;
  }

  async duplicarTareo(item: any, id: number[], actualizar: boolean = false) {
    for(const [index,id_] of id.entries()){
      const fila = this.recuperarFila(id_);
      await fila
          .locator('td.cdk-column-icDuplicarTarea')
          .locator('div.cursor-pointer')
          .click();
      if(actualizar){
        await this.filtroCalendario(item.fecha[index]);
        await this.llenarMinutos(item.minutosRegulares);
      }
      await this.guardarYEnviar();
    }
  }
 
  /**
   * Funcion que devuelve los minutos diposibles que muestra el formulario 
   * depende del día que se escoge
   * @returns 
   */
  async obtenerMinutosDisponibles(): Promise<number> {
    // Espera a que el sistema recalcule los minutos
    //await expect(this.lblTiempoDisponible).not.toContainText('Disp. 0 mins. ( 0 hrs).');
    await this.page.waitForTimeout(2000)
    const texto = await this.lblTiempoDisponible.innerText();
    const match = texto.match(/Disp\.\s*(\d+)\s*mins/i);

    if (!match) {
      throw new Error(`No se pudo leer el tiempo disponible: ${texto}`);
    }

    return Number(match[1]);
  }

  recuperarFila(id: number): Locator{
    const fila = this.page.locator('tr').filter({
          has: this.page.locator('td.cdk-column-nId', {
              hasText: String(id)
          })
    });
    return fila;
  }

  async recuperarFechaYHora(fila: Locator): Promise<TareoEliminado>{
    let fecha, horas: string;
    fecha = 
      (await fila
          .locator('td.cdk-column-dFecha_Registro')
          .innerText())
          .trim();

      horas = 
      (await fila
          .locator('td.cdk-column-bgAmount')
          .innerText())
          .trim();
      return {fecha,horas};
  }

  /**
   * Funcion para navegar al modulo
   */
  async navegarModulo() {
    await this.btnMenuIzquierdo.click();
    await this.btnModuloTareo.click();
    await this.page.waitForURL('**/tareo/lista');
  }

  /**
   * Funcion que consume el componente de calendario
   * @param fechaDesde si se pasa unicamente este parametro el calendario hace click a una fehca
   * @param fechaHasta si se pasa esta fecha, el calendario selecciona un intervalo
   */
  async filtroCalendario(fechaDesde: string, fechaHasta?: string) {
    await this.calendar.seleccionarFecha(fechaDesde, fechaHasta);
  }

  /**
   * Funcion Aceptar / Cancelar, no confundir con Guardar y Enviar
   */
  async aceptar(){
    // para cada paso se espera hasta 2 segundo de renderizado
    await expect(this.btnAceptar).toBeVisible({timeout: 2000});
    await this.btnAceptar.click();

    const checkProceso = this.page.getByText('check_circle ¡Procesado con éxito!Aceptar');
    await expect(checkProceso).toBeVisible({timeout: 2000});
  }

  async cancelar(){
    // para cada paso se espera hasta 2 segundo de renderizado
    await expect(this.btnCancelar).toBeVisible({timeout: 2000});
    await this.btnCancelar.click();

    const checkProceso = this.page.getByText('help ¿Salir sin Guardar?CancelarAceptar').isVisible({timeout: 2000});
    //si se visualiza un modal de verificacion
    if(await checkProceso){
      await this.btnCancelar.click();
    }
  }
}