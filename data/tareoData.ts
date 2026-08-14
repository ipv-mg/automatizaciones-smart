import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export interface TareoData {
    correo: string;
    password: string;
    fecha: string;
    minutosRegulares: string;
    minutosNoRegulares?: string;
    proyecto: string;
    requerimiento: string;
    categoria: string;
    tipoHora: string;
    descripcion: string;
    hora: string;
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
        correo: "julio.julca@materiagris.pe",
        password: defaultPassword,
        fecha: "11 de agosto de 2026",
        minutosRegulares: "475",
        minutosNoRegulares: "120",
        proyecto: "PRY - MG (CARLOS)",
        requerimiento: "RQ - CAPACITACIONES INTERNAS",
        categoria: "ASEGURAMIENTO DE LA CALIDAD",
        tipoHora: TipoHora.REGULAR,
        descripcion: "PRUEBAS DE AUTOMATIZACIÓN",
        hora: "18:01"
    },
    {
        correo: "omar.quispe@materiagris.pe",
        password: defaultPassword,
        fecha: "11 de agosto de 2026",
        minutosRegulares: "475",
        proyecto: "PRY - MG (CARLOS)",
        requerimiento: "RQ - CAPACITACIONES INTERNAS",
        categoria: "ASEGURAMIENTO DE LA CALIDAD",
        tipoHora: TipoHora.REGULAR,
        descripcion: "PRUEBAS DE AUTOMATIZACIÓN",
        hora: "18:01"
    }
];