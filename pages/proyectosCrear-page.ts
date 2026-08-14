import { Page, Locator } from '@playwright/test';
import path from 'path';
import { ProjectFormData } from '@data/proyectosData';
import { CalendarComponent } from './components/CalendarComponent';
import { TIMEOUT } from 'dns';

export class ProjectsPage {
  readonly page: Page;
  private calendar: CalendarComponent;

  // Navegación
  readonly btnMenu: Locator;
  readonly linkProyectos: Locator;
  readonly btnCrearProyecto: Locator;

  // Formulario
  readonly comboTipo: Locator;
  readonly inputNombreProyecto: Locator;
  readonly comboCoordinador: Locator;
  readonly inputNombreCliente: Locator;
  readonly comboAcceso: Locator;
  readonly comboColaboradores: Locator;
  readonly comboServicio: Locator;
  readonly comboLideres: Locator;
  readonly inputDescripcion: Locator;

  // Confirmación
  readonly btnGuardar: Locator;
  readonly btnAceptar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calendar = new CalendarComponent(page);

    // Navegación
    this.btnMenu = page.getByRole('button', { name: 'menu' });
    this.linkProyectos = page.getByRole('link', { name: 'business_center Proyectos y' });
    this.btnCrearProyecto = page.getByRole('button', { name: 'add_circle Crear proyecto' });

    // Inputs y Combos
    this.comboTipo = page.getByRole('combobox', { name: 'Tipo' });
    this.inputNombreProyecto = page.getByRole('textbox', { name: 'Escribe el nombre del proyecto' });
    this.comboCoordinador = page.getByRole('combobox', { name: 'Coordinador' });
    this.inputNombreCliente = page.getByRole('textbox', { name: 'Nombre del proyecto (Cliente)' });
    this.comboAcceso = page.getByRole('combobox', { name: 'Acceso' });
    this.comboColaboradores = page.getByRole('combobox', { name: 'Colaboradores' });
    this.comboServicio = page.getByRole('combobox', { name: 'Servicio' });
    this.comboLideres = page.getByRole('combobox', { name: 'Líderes' });
    this.inputDescripcion = page.getByRole('textbox', { name: 'Ingresa la descripción del' });

    // Botones
    this.btnGuardar = page.getByRole('button', { name: 'Guardar' });
    this.btnAceptar = page.getByRole('button', { name: 'Aceptar' });
  }

  async irAProyectos() {
    await this.btnMenu.click();
    await this.linkProyectos.click();
    await this.btnCrearProyecto.click();
  }

  /**
   * Helper privado para seleccionar opciones de combo esperando que el desplegable se renderice.
   */
  private async seleccionarCombo(combo: Locator, opcionTexto: string) {
    await combo.click({timeout: 3000});
    const option = this.page.getByRole('option', { name: opcionTexto });
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  /**
   * Método único para llenar y enviar todo el formulario de creación.
   */
  async crearProyecto(data: ProjectFormData) {
    // 1. Tipo y Nombre
    await this.seleccionarCombo(this.comboTipo, data.tipo);
    await this.inputNombreProyecto.fill(data.nombreProyecto);

    // 2. Coordinador y Cliente
    await this.seleccionarCombo(this.comboCoordinador, data.coordinador);
    await this.inputNombreCliente.fill(data.nombreCliente);

    // 3. Acceso y Colaboradores
    await this.seleccionarCombo(this.comboAcceso, data.acceso);
    for (const colaborador of data.colaboradores) {
      await this.seleccionarCombo(this.comboColaboradores, colaborador);
    }

    // 4. Servicio y Líder
    await this.seleccionarCombo(this.comboServicio, data.servicio);
    await this.comboLideres.click();
    await this.comboLideres.fill(data.liderFiltro);
    await this.seleccionarCombo(this.comboLideres, data.liderNombre);

    // 5. Fechas y Descripción
    await this.calendar.seleccionarFecha(data.fechaInicioText,data.fechaFinText);
    await this.inputDescripcion.fill(data.descripcion);

    // 6. Guardar
    await this.btnGuardar.click();
    await this.btnAceptar.click();
  }

}