import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

/**
 * Catálogo de tipos de solicitud tal como aparecen en el combobox
 * "Tipo de solicitud" (se respeta el ligature/ícono con el que Angular
 * Material arma el accessible name de cada opción).
 */
export const TIPO = {
  ALIMENTACION: ' GASTO POR ALIMENTACIÓN',
  MOVILIDAD: ' GASTO POR MOVILIDAD',
  COCHERAS: 'garage DEVOLUCIÓN DE COCHERAS',
  OTROS_GASTOS: 'local_atm OTROS GASTOS',
} as const;

/**
 * Estructura de una solicitud del módulo de Tesorería.
 * `proyecto`, `requerimiento` y `personaSeleccionada` son opcionales porque
 * no todos los tipos de solicitud muestran esos campos en el formulario
 * (por ejemplo TIPO.COCHERAS no pide proyecto/requerimiento).
 */
export interface SolicitudReembolso {
  correo: string;
  password: string;
  fecha: string;
  tipoSolicitud: string;
  monto: string;
  proyecto?: string;
  requerimiento?: string;
  personaSeleccionada?: string[];
  motivo: string;
  archivoComprobante: string;
}

/**
 * Única estructura de datos, reutilizada por el `for` del spec para generar
 * un test por cada solicitud, sin importar el tipo de gasto.
 */
export const solicitudesReembolso: SolicitudReembolso[] = [
  {
    correo: 'laura.valera@materiagris.pe',
    password: defaultPassword,
    fecha: '9 de julio de 2026',
    tipoSolicitud: TIPO.ALIMENTACION,
    monto: '1000',
    proyecto: 'PRY - MG (CARLOS)',
    requerimiento: 'RQ - ACTIVIDADES NO',
    personaSeleccionada: ['MENDOZA MARQUINA KIMBERLY'],
    motivo: 'AUTOMATIZACION DE TESORERIA PWRIGHT',
    archivoComprobante: 'imagen.jpg',
  }
];