import { test } from '@playwright/test';
import { usuarios } from '@data/marcasData';
import { CrearMarcasFlow } from '@flows/crearMarcasFlow';
import { MarcasService } from '@services/marcasService';
import { LoginPage } from '@pages';


for(const usuario of usuarios){

test(`Creación marcas ${usuario.correo}`, async({page,request})=>{

   const login = new LoginPage(page);
   const flow = new CrearMarcasFlow(new MarcasService(request));

   await login.navegar();
   await login.iniciarSesion(usuario.correo,usuario.password ?? '');
   await flow.ejecutar(page,usuario);
   
});
}