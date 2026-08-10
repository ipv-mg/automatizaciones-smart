import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export const MOTIVO = {
  SMART: "Problemas con Smart",
  BIOMETRICO: "Problemas con Biométrico",
  OLVIDE: "Olvidé marcar",
  ERROR: "Marqué de forma incorrecta",
  EVENTO: "Reunión o Evento",
  OTROS: "Otros"
} as const;

export const TIPO = {
  REGISTRAR: "REGISTRAR",
  EDITAR: "EDITAR",
  ELIMINAR: "ELIMINAR"
} as const;

export interface RegularizacionMarca {
  correo: string;
  password: string;
  fecha: string;
  /** estos datos representan los arreglos para manejar la regularización
  @registrar → consume horaNueva
  @editar → consume horaActual y horaNueva
  @eliminar → consume horaActual
  */
  horaNueva: string[];
  horaActual: string[]; 
  horaEliminar: string[];
  motivo: string;
  texto: string;
  /**
  @tipo determina si el flujo a seguir es registrar, editar o eliminar
  */
  tipo: string;
}

export const regularizacion: RegularizacionMarca[] = [
  {
    correo: "christian.romero@materiagris.pe",
    password: defaultPassword, 
    fecha: "3 de agosto de 2026",
    horaNueva: ["19:30"],
    horaActual: ["19:00"],
    horaEliminar: [""],
    motivo: MOTIVO.OTROS,
    texto: "AUTOMATIZACION DE REGULARIZACION DE MARCA",
    tipo: TIPO.EDITAR
  }
];

export const regularizacionSuite = {
    cantidad: 5,
    fechaInicio: '2026-08-01',
    fechaFin: '2026-08-31'
};