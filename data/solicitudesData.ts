import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export const solicitudes = [
  {
    correo: 'roxana.condori@materiagris.pe',
    password: defaultPassword,
    fecha: '24 de julio de',
    hora: '16:00',
    cantidad: '2 HORAS',
    responsable: 'DURAND FLORES CARLOS ENRIQUE',
    motivo: 'MOTIVOS PERSONALES',
    descripcion: 'pruebas de calidad'
  }
];
