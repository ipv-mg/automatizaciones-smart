import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export interface UsuarioMarca {
  correo: string;
  password?: string;
  nid_usuario: number;
  dFecha_Jornada: string;
  dTiempo_Marca: string[];
  nMethod: number;
}

export const usuarios: UsuarioMarca[] = [
  {
    correo: "ivan.principe@materiagris.pe",
    password: defaultPassword, 
    nid_usuario: 312,
    dFecha_Jornada: "2026-07-21",
    dTiempo_Marca: [
      "2026-07-21T09:00:00",
      "2026-07-21T13:00:00",
      "2026-07-21T13:45:00",
      "2026-07-21T18:00:00"
    ],
    nMethod: 6,
  }
];



