import { Page, Locator } from '@playwright/test';
import { calcularDiferenciaMeses, parseDate, formatAriaLabelDate } from '../../utils/dateUtils';

export class CalendarComponent {
  readonly page: Page;
  readonly btnOpenCalendar: Locator;
  readonly btnNextMonth: Locator;
  readonly btnPreviousMonth: Locator;

  constructor(page: Page) {
    this.page = page;
    this.btnOpenCalendar = page.getByRole('button', { name: 'Open calendar' });
    this.btnNextMonth = page.getByRole('button', { name: 'Next month' });
    this.btnPreviousMonth = page.getByRole('button', { name: 'Previous month' });
  }

  /**
   * Selecciona una fecha en el calendario.
   * Si la fecha no está visible, abre el calendario y navega hasta el mes correspondiente.
   * @param fechaInput La fecha en el formato esperado por el calendario (ej: '5', '12', o el aria-label como '05/08/2023' dependiendo de la UI)
   */
  async seleccionarFecha(fechaInput: string): Promise<void> {
    const fechaObjetivo = parseDate(fechaInput);
    
    // Tratamos de armar el nombre del botón de manera inteligente
    // Si la fecha input es "DD/MM/YYYY", Angular Material usa "D de mes de YYYY" en el aria-label.
    // Si ya era un string como "31 de agosto de", lo usamos como fallback.
    let nombreBoton = fechaInput;
    if (!isNaN(fechaObjetivo.getTime()) && fechaInput.includes('/')) {
        nombreBoton = formatAriaLabelDate(fechaObjetivo);
    }

    // 1. Intentamos buscar si la fecha ya está visible
    let btnFechaDirecta = this.page.getByRole('button', { name: nombreBoton, exact: true });
    
    // Si no se encuentra con exact: true (ej. porque el input venía truncado "31 de agosto de"), 
    // intentamos buscar usando expresión regular que inicie con ese texto para evitar que "9" haga match con "19" o "29"
    if (!(await btnFechaDirecta.isVisible())) {
      btnFechaDirecta = this.page.getByRole('button', { name: new RegExp('^' + nombreBoton) }).first();
    }
    
    if (await btnFechaDirecta.isVisible()) {
      await btnFechaDirecta.click({ timeout: 2000 });
      return;
    }

    // 2. Si no es visible, intentamos abrir el calendario
    if (await this.btnOpenCalendar.isVisible()) {
      await this.btnOpenCalendar.click();
    }

    // 3. Calculamos la diferencia de meses
    if (!isNaN(fechaObjetivo.getTime())) {
      const diffMeses = calcularDiferenciaMeses(fechaObjetivo);

      // Navegar
      if (diffMeses > 0) {
        for (let i = 0; i < diffMeses; i++) {
          await this.btnNextMonth.click();
        }
      } else if (diffMeses < 0) {
        for (let i = 0; i < Math.abs(diffMeses); i++) {
          await this.btnPreviousMonth.click();
        }
      }
    }

    // Finalmente, hacer clic en la fecha
    await btnFechaDirecta.click({ timeout: 2000});
  }
}
