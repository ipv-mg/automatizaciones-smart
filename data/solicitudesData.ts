import dotenv from 'dotenv';
dotenv.config();

const defaultPassword = process.env.DEFAULT_QA_PASSWORD || '';

export interface Solicitud{
  correo: string,
  password: string,
  fecha: string,
  hora: string,
  cantidadHoras?: string,
  cantidadDias?: string,
  responsable: string,
  motivo: string,
  descripcion: string,
  tipoSolicitud: string,
  filtroRadio: string,
  colaboradorNombre: string,
  motivoDetalle: string,
  archivoAdjunto: string,
} 

export const TipoSolicitud = {
  HORAS: 'PERMISO POR HORAS',
  DIAS: 'PERMISO POR DÍAS',
}

export const FiltroRadio = {
  TODOS: 'TODOS',
}

export const Motivo = {
  PERSONALES: 'MOTIVOS PERSONALES'
}

export const solicitudes = [
  {
    correo: 'roxana.condori@materiagris.pe',
    password: defaultPassword,
    fecha: '28 de agosto de 2026',
    hora: '16:00',
    cantidadHoras: '2 HORAS',
    responsable: 'DURAND FLORES CARLOS ENRIQUE',
    motivo: Motivo.PERSONALES,
    descripcion: 'pruebas de calidad',
    tipoSolicitud: TipoSolicitud.HORAS,
    filtroRadio: FiltroRadio.TODOS,
    colaboradorNombre: 'QUISPE APON OMAR GABRIEL ANDRE',
    motivoDetalle: 'motivos personales',
    archivoAdjunto: 'imagen.jpg'

  },
  {
    correo: 'omar.quispe@materiagris.pe',
    password: defaultPassword,
    fecha: '24 de agosto de 2026',
    hora: '16:00',
    cantidadDias: '1 DÍA',
    responsable: 'DURAND FLORES CARLOS ENRIQUE',
    motivo: Motivo.PERSONALES,
    descripcion: 'pruebas de calidad',
    tipoSolicitud: TipoSolicitud.DIAS,
    filtroRadio: FiltroRadio.TODOS,
    colaboradorNombre: 'QUISPE APON OMAR GABRIEL ANDRE',
    motivoDetalle: 'motivos personales',
    archivoAdjunto: 'imagen.jpg'

  }
];
