import dotenv from 'dotenv';
dotenv.config();
const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';


export interface ProjectFormData {
  correo: string;
  password: string;
  tipo: string;
  nombreProyecto: string;
  coordinador: string;
  nombreCliente: string;
  acceso: string;
  colaboradores: string[];
  servicio: string;
  liderFiltro: string;
  liderNombre: string;
  fechaInicioText: string;
  fechaFinText: string;
  descripcion: string;
}

export const projectsData: ProjectFormData = {
  correo: "ivan.principe@materiagris.pe",
  password: defaultPassword, 
  tipo: 'PRY',
  nombreProyecto:  'PRUEBA DE AUTOMATIZACIÓN 3',
  coordinador: 'DURAND FLORES CARLOS (MATERIA GRIS S.A.C)',
  nombreCliente:  'AUTOMATIZACIONES Mg 3',
  acceso: 'PÚBLICO',
  colaboradores: [
    'MOGOLLON SEÑAS ANGELO SAY',
    'PRINCIPE VELASQUEZ IVAN',
  ],
  servicio:  'PROYECTO',
  liderFiltro: 'rolan',
  liderNombre: 'TITO ALEGRE ROLANDO ULISES',
  fechaInicioText: '1 de julio de 2026',
  fechaFinText: '31 de agosto de',
  descripcion: 'automatizaciones analisis',
};