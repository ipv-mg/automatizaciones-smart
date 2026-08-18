import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export interface UsuarioMarca {
  correo: string;
  password: string;
  dFecha_Jornada: string;
  dTiempo_Marca: string[];
  nMethod: number;
}

export const usuarios: UsuarioMarca[] = [
  {
    correo: "julio.julca@materiagris.pe",
    password: defaultPassword, 
    dFecha_Jornada: "2026-08-11",
    dTiempo_Marca: [
      "2026-08-11T09:05:00",
      "2026-08-11T13:00:00",
      "2026-08-11T14:00:00",
      "2026-08-11T18:00:00",
      "2026-08-11T18:15:00",
      "2026-08-11T20:15:00"
    ],
    nMethod: 6,
  },
  {
    correo: "omar.quispe@materiagris.pe",
    password: defaultPassword, 
    dFecha_Jornada: "2026-08-11",
    dTiempo_Marca: [
      "2026-08-11T09:05:00",
      "2026-08-11T13:00:00",
      "2026-08-11T14:00:00",
      "2026-08-11T18:00:00",
    ],
    nMethod: 6,
  }
];



