import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export interface UsuarioMarca {
  email: string;
  password?: string;
  nid_usuario: number;
  dFecha_Jornada: string;
  dTiempo_Marca: string[];
  nMethod: number;
}

export const usuarios: UsuarioMarca[] = [
  {
    email: "ivan.principe@materiagris.pe",
    password: defaultPassword, 
    nid_usuario: 312,
    dFecha_Jornada: "2026-07-14",
    dTiempo_Marca: [
      "2026-07-14T09:00:00",
      "2026-07-14T13:00:00",
      "2026-07-14T14:00:00",
      "2026-07-14T18:00:00"
    ],
    nMethod: 6,
  },
  {
    email: "omar.quispe@materiagris.pe",
    password: defaultPassword, 
    nid_usuario: 243,
    dFecha_Jornada: "2026-07-14",
    dTiempo_Marca: [
      "2026-07-14T08:30:00",
      "2026-07-14T17:30:00"
    ],
    nMethod: 6,
  },
  {
    email: "angelo.mogollon@materiagris.pe",
    password: defaultPassword, 
    nid_usuario: 193,
    dFecha_Jornada: "2026-07-20",
    dTiempo_Marca: [
      "2026-07-14T09:30:00",
      "2026-07-14T13:00:00",
      "2026-07-14T17:30:00"
    ],
    nMethod: 6,
  }
];



