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
    correo: "christian.romero@materiagris.pe",
    password: defaultPassword, 
    dFecha_Jornada: "2026-08-03",
    dTiempo_Marca: [
      "2026-08-03T19:00:00"
    ],
    nMethod: 6,
  }
];



