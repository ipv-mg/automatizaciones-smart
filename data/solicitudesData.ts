import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export const solicitudes = [
  {
    correo: 'roxana.condori@materiagris.pe',
    password: defaultPassword,
    fecha: '20 de agosto de 2026',
    hora: '16:00',
    cantidad: '2 HORAS',
    cantidadDias: '1 DÍA',
    responsable: 'DURAND FLORES CARLOS ENRIQUE',
    motivo: 'MOTIVOS PERSONALES',
    descripcion: 'pruebas de calidad',
    tipoSolicitud: 'PERMISO POR HORAS',
    filtroRadio: 'TODOS',
    colaboradorNombre: 'QUISPE APON OMAR GABRIEL ANDRE',
    motivoDetalle: 'mptivos personales',
    archivoAdjunto: 'imagen.jpg'

  },
  {
    correo: 'omar.quispe@materiagris.pe',
    password: defaultPassword,
    fecha: '20 de agosto de 2026',
    hora: '16:00',
    cantidad: '2 HORAS',
    cantidadDias: '1 DÍA',
    responsable: 'DURAND FLORES CARLOS ENRIQUE',
    motivo: 'MOTIVOS PERSONALES',
    descripcion: 'pruebas de calidad',
    tipoSolicitud: 'PERMISO POR HORAS',
    filtroRadio: 'TODOS',
    colaboradorNombre: 'QUISPE APON OMAR GABRIEL ANDRE',
    motivoDetalle: 'mptivos personales',
    archivoAdjunto: 'imagen.jpg'

  },
  {
    correo: 'angelo.mogollon@materiagris.pe',
    password: defaultPassword,
    fecha: '20 de agosto de 2026',
    hora: '16:00',
    cantidad: '2 HORAS',
    cantidadDias: '1 DÍA',
    responsable: 'DURAND FLORES CARLOS ENRIQUE',
    motivo: 'MOTIVOS PERSONALES',
    descripcion: 'pruebas de calidad',
    tipoSolicitud: 'PERMISO POR DÍAS',    
    filtroRadio: 'TODOS',
    colaboradorNombre: 'QUISPE APON OMAR GABRIEL ANDRE',
    motivoDetalle: 'mptivos personales',
    archivoAdjunto: 'imagen.jpg'

  },
  {
    correo: 'abraham.chevarria@materiagris.pe',
    password: defaultPassword,
    fecha: '20 de agosto de 2026',
    hora: '16:00',
    cantidad: '2 HORAS',
    cantidadDias: '1 DÍA',
    tipoSolicitud: 'PERMISO POR DÍAS',
    responsable: 'DURAND FLORES CARLOS ENRIQUE',
    motivo: 'MOTIVOS PERSONALES',
    descripcion: 'pruebas de calidad',        
    filtroRadio: 'TODOS',
    colaboradorNombre: 'QUISPE APON OMAR GABRIEL ANDRE',
    motivoDetalle: 'mptivos personales',
    archivoAdjunto: 'imagen.jpg'

  }
];
