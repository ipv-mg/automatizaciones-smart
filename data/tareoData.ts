import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export const tareo = [
    {
        correo: 'angelo.mogollon@materiagris.pe',
        password: defaultPassword,
        fecha: '9/6/2026',
        minutos: '15',
        proyecto: 'PRY - MG (CARLOS)',
        requerimiento: 'RQ - CAPACITACIONES INTERNAS',
        categoria: 'ASEGURAMIENTO DE LA CALIDAD',
        tipo_hora: 'HORARIO REGULAR',
        descripcion: 'PRUEBAS DE AUTOMATIZACIÓN CON PLAYWRIGHT',
        hora: '18:01'
    }
];