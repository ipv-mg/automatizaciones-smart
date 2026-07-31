import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export interface TareoData {
    correo: string;
    password: string;
    fecha: string;
    minutos: string;
    proyecto: string;
    requerimiento: string;
    categoria: string;
    tipoHora: string;
    descripcion: string;
    hora: string;
    path: number; // 1: card, 2: modulo
}

export const TipoHora = {
  REGULAR: "HORARIO REGULAR",
  COMPENSACION: "COMPENSACION",
  EXTRA: "EXTRAS",
  AVANCE: "AVANCE",
  RECUPERACION: "RECUPERACION",
} as const;

export const tareo: TareoData[] = [
    {
        correo: "ivan.principe@materiagris.pe",
        password: defaultPassword,
        fecha: "21/7/2026",
        minutos: "475",
        proyecto: "PRY - MG (CARLOS)",
        requerimiento: "RQ - CAPACITACIONES INTERNAS",
        categoria: "ASEGURAMIENTO DE LA CALIDAD",
        tipoHora: TipoHora.REGULAR,
        descripcion: "PRUEBAS DE AUTOMATIZACIÓN",
        hora: "18:01",
        path: 2
    }
];