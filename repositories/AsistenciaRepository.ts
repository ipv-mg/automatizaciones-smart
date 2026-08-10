import { Pool } from 'pg';

export class UsuarioRepository {

    constructor(private readonly db: Pool) {}

    async crearAsistencia(fecha: string): Promise<void> {

        await this.db.query(
            `SELECT * FROM fn_create_asistence($1)`,
            [fecha]
        );
    }

    async actualizarAttendance(
        idUsuario: number,
        fechaInicio: string,
        fechaFin: string
    ): Promise<void> {

        await this.db.query(
            `SELECT * FROM fn_update_attendance($1, $2, $3, 172)`,
            [idUsuario, fechaInicio, fechaFin]
        );
    }
}