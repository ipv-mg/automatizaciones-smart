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


  async abrirCalendario() {
    // 2. Si no es visible, intentar abrir el calendario (si existe botón)
    if (await this.btnOpenCalendar.isVisible()) {
      await this.btnOpenCalendar.click();
    }
  }

  /**
   * Navega y hace clic en una fecha específica dentro del calendario.
   * Método privado helper para reutilizar en selecciones simples o rangos.
   */
  private async seleccionarUnaFecha(fechaInput: string): Promise<void> {
    const fechaObjetivo = parseDate(fechaInput);
    
    let nombreBoton = fechaInput;
    if (!isNaN(fechaObjetivo.getTime()) && fechaInput.includes('/')) {
      nombreBoton = formatAriaLabelDate(fechaObjetivo);
    }

    // 1. Verificar si la fecha ya es visible
    let btnFechaDirecta = this.page.getByRole('button', { name: nombreBoton, exact: true });
    
    if (!(await btnFechaDirecta.isVisible())) {
      btnFechaDirecta = this.page.getByRole('button', { name: new RegExp('^' + nombreBoton) }).first();
    }
    
    if (await btnFechaDirecta.isVisible()) {
      await btnFechaDirecta.click({ timeout: 2000 });
      return;
    }

    // 3. Navegar en los meses si aplica
    if (!isNaN(fechaObjetivo.getTime())) {
      const diffMeses = calcularDiferenciaMeses(fechaObjetivo);

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

    // 4. Clic en el día
    await btnFechaDirecta.click();
  }

  /**
   * Selecciona una fecha única o un rango de fechas (Desde - Hasta).
   * @param fechaDesde Fecha única o fecha de inicio en formato 'DD/MM/YYYY' o similar.
   * @param fechaHasta (Opcional) Fecha de fin si se trata de un rango de fechas.
   */
  async seleccionarFecha(fechaDesde: string, fechaHasta?: string): Promise<void> {
    // Seleccionar la fecha de inicio (o fecha única)
    await this.abrirCalendario();
    await this.seleccionarUnaFecha(fechaDesde);

    // Si se envió la segunda fecha, seleccionarla a continuación
    if (fechaHasta) {
      await this.seleccionarUnaFecha(fechaHasta);
    }
  }
}