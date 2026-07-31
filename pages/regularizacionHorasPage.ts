import { Page, Locator, expect } from '@playwright/test';

export class RegularizacionHorasPage {
    readonly page: Page;
    readonly cardRegularizarBtn: Locator;
    readonly nuevaSolicitudBtn : Locator;
    readonly nuevaMarcacionBtn : Locator;
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
        await this.page.getByRole('button', { name: fecha }).click({timeout: 2000});
    }

    async abrirPanelDerecho(){
        await this.nuevaSolicitudBtn.click();
        await expect(this.nuevaMarcacionBtn).toBeVisible();
    }

    async enviarSolicitud(cantidad: number){
        await this.page.getByRole('button', { name: `Enviar (${cantidad})` }).click();
        await this.aceptarBtn.click({timeout: 2000});
    }

    async registrarMarca(hora: string, motivo: string, texto: string){
        await this.nuevaMarcacionBtn.click();
        await this.horaInput.fill(hora);
        await this.motivoCombo.click();
        await this.page.getByRole('option', { name: motivo }).click();

        const esVisible = await this.textoInput.waitFor({ state: 'visible', timeout: 1000 }).then(() => true).catch(() => false);
        if (esVisible) {
            await this.textoInput.fill(texto);
        }
        await this.agregarAccionBtn.click();
    }

    async editarMarca(){
        /*
        TODO
        */
    }

    async eliminarMarca(){
        /*
        TODO
        */
    }

}


