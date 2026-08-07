import { Page, Locator, expect } from '@playwright/test';

export class RegularizacionHorasPage {
    readonly page: Page;
    readonly cardRegularizarBtn: Locator;
    readonly nuevaSolicitudBtn : Locator;
    readonly nuevaMarcacionBtn : Locator;
    readonly editarMarcacionBtn : Locator;
    readonly eliminarMarcacionBtn : Locator;
    readonly horaInput: Locator;
    readonly motivoCombo: Locator;
    readonly textoInput: Locator;
    readonly agregarAccionBtn: Locator;
    //readonly confirmLbl: Locator
    readonly aceptarBtn: Locator;

    constructor(page: Page){
        this.page = page;
        this.cardRegularizarBtn = page.getByRole('button', { name: 'add_circle Regularizar marcas' });
        this.nuevaSolicitudBtn = page.getByRole('button', { name: 'add Nueva Solicitud' });
        this.nuevaMarcacionBtn = page.getByRole('button', { name: 'add Agregar Nueva Marcación' });
        this.editarMarcacionBtn = page.getByRole('button', { name: 'edit', exact: true });
        this.eliminarMarcacionBtn = page.getByRole('button', { name: 'delete', exact: true });
        this.horaInput = page.getByRole('textbox', { name: '--:--' });
        this.motivoCombo = page.getByRole('combobox', { name: 'Motivo de la solicitud' });
        this.textoInput = page.getByRole('textbox', { name: 'Describe el motivo...' });
        this.agregarAccionBtn = page.getByRole('button', { name: 'Agregar Acción' });
        //this.confirmLbl = page.getByText('schedule 09:00 | Inicio today 31/07/2026 REGISTRO En Proceso');
        this.aceptarBtn = page.getByRole('button', { name: 'Aceptar' });
    }

    async abrirModal(){
        await this.cardRegularizarBtn.click();
        await expect(this.nuevaSolicitudBtn).toBeVisible();
    }

    async seleccionarFecha(fecha: string){
        await this.page.getByRole('button', { name: fecha, exact: true }).click({timeout: 2000});
    }

    async abrirPanelDerecho(){
        await this.nuevaSolicitudBtn.click();
        await expect(this.nuevaMarcacionBtn).toBeVisible();
    }

    async enviarSolicitud(cantidad: number){
        await this.page.getByRole('button', { name: `Enviar (${cantidad})` }).click();
        await this.aceptarBtn.click({timeout: 2000});
    }

    async registrarMarca(horaNueva: string[], motivo: string, texto: string){
        for(const iter of horaNueva){
            await this.nuevaMarcacionBtn.click({timeout: 3000});
            await this.horaInput.fill(iter);
            await this.llenarMotivoYTexto(motivo, texto);
            await this.agregarAccionBtn.click();
        }
    }

async editarMarca(horaActual: string[], horaNueva: string[], motivo: string, texto: string) {
        try {
            if (horaActual.length !== horaNueva.length) {
                throw new Error("La cantidad de horas existentes y nuevas no coincide.");
            }

            for (const [index, hora] of horaActual.entries()) {
                const fila = this.obtenerFilaPorHora(hora);
                await fila.getByRole('button', { name: 'edit', exact: true }).click();
                await this.horaInput.fill(horaNueva[index]);
                await this.llenarMotivoYTexto(motivo, texto);
                await this.agregarAccionBtn.click();
            }

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error al editar la marca: ${error.message}`);
            }
            throw error;
        }        
    }

    async eliminarMarca(horaActual: string[], motivo: string, texto: string) {
        try {
            for (const hora of horaActual) {
                const fila = this.obtenerFilaPorHora(hora);
                await fila.getByRole('button', { name: 'delete', exact: true }).click();
                await this.llenarMotivoYTexto(motivo, texto);
                await this.agregarAccionBtn.click();
            }

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error al eliminar la marca: ${error.message}`);
            }
            throw error;
        }
    }

    /*
    Funciones auxiliares del Page
    */

    private obtenerFilaPorHora(hora: string): Locator {
        // Encapsula la búsqueda del contenedor exacto de la marca por su hora en tiempo real
        return this.page.locator('tr, li, [role="row"], div')
            .filter({ hasText: hora })
            .filter({ has: this.editarMarcacionBtn.or(this.eliminarMarcacionBtn) })
            .last();
    }

    async llenarMotivoYTexto(motivo: string, texto: string) {
        await this.motivoCombo.click();
        await this.page.getByRole('option', { name: motivo }).click();
        
        // isVisible() evita registrar un "TimeoutError" en rojo dentro del Trace Viewer
        if (await this.textoInput.isVisible()) {
            await this.textoInput.fill(texto);
        } else {
            console.log('El campo de texto no es visible, se omite el llenado del mismo');
        }
    }

    async aplicaDiaSiguiente() {
        /*
        *await page.getByRole('checkbox', { name: 'Aplica para el día siguiente' }).check();
        *await page.getByRole('checkbox', { name: 'Aplica para el día siguiente' }).uncheck();
        */
    }
}



