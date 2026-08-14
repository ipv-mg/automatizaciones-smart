import { Page, Locator, expect } from '@playwright/test';

export class BuscarColaborador{

    readonly page: Page;
    readonly btnBuscarColaborador: Locator;

    constructor(page: Page){
        this.page = page;
        this.btnBuscarColaborador = page.getByRole('combobox', { name: 'Buscar Colaborador' });
    }

    /**
     * Funcion para seleccionar barra de busqueda agregar el texto de similitud y seleccionar al colaborador
     */
    async seleccionarColaborador(nombre: string): Promise<void>{
        const btnColaborador = this.page.getByRole('option', { name: nombre })

        await this.btnBuscarColaborador.click({timeout: 4000});
        await this.btnBuscarColaborador.fill(nombre);
        await btnColaborador.click({timeout : 4000});       
    }   
}
