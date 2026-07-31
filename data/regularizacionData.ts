import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export interface RegularizacionMarca {
  correo: string;
  password: string;
  fecha: string;
  hora: string[];
  motivo: string;
  texto: string;
}

export const MOTIVO = {
  SMART: "Problemas con Smart",
  BIOMETRICO: "Problemas con Biométrico",
  OLVIDE: "Olvidé marcar",
  ERROR: "Marqué de forma incorrecta",
  EVENTO: "Reunión o Evento",
  OTROS: "Otros"
} as const;

export const regularizacion: RegularizacionMarca[] = [
  {
    correo: "ivan.principe@materiagris.pe",
    password: defaultPassword, 
    fecha: "20 de julio de",
    hora: ["09:00","13:00"],
    motivo: MOTIVO.OTROS,
    texto: "AUTOMATIZACION DE REGULARIZACION DE MARCA"
  }
];
