import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export const gastosAlimentacion = [
  {
    correo: 'laura.valera@materiagris.pe',
    password: defaultPassword,
    fecha: '5 de julio de 2026',
    tipoSolicitud: 'GASTO POR ALIMENTACIÓN',
    monto: '1000',
    proyecto: 'PRY - MG (CARLOS)',
    requerimiento: 'RQ - ACTIVIDADES NO',
    motivo: 'PRUEBAS DE CALIDAD',
    archivoComprobante: 'imagen.jpg',
  },
];
