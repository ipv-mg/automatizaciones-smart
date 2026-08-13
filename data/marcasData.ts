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
    correo: "ivan.principe@materiagris.pe",
    password: defaultPassword, 
    dFecha_Jornada: "2026-08-12",
    dTiempo_Marca: [
      "2026-08-12T09:14:00",
            "2026-08-12T13:00:00",
                  "2026-08-12T14:00:00",
                        "2026-08-12T20:00:00"

    ],
    nMethod: 6,
  }
];



