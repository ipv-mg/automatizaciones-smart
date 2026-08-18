import { Pool } from 'pg';

export class UsuarioRepository {

    constructor(private readonly db: Pool) {}

    async crearMarcasRecomendadas(
        fecha: string,
        nidColaborador: number
    ): Promise<void> {

        await this.db.query(
            `SELECT * FROM fn_create_recommended_marks($1, ARRAY[$2])`,
            [fecha, nidColaborador]
        );
    }
}