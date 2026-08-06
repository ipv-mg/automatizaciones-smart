import { Pool } from 'pg';

export class UsuarioRepository {

    constructor(private readonly db: Pool) {}

    async obtenerIdPorCorreo(correo: string): Promise<number> {

        const resultado = await this.db.query(
            `SELECT nid_usuario FROM usuarios WHERE semail = $1`,[correo]);

        if (resultado.rowCount === 0) {
            throw new Error(`No existe un usuario con el correo ${correo}`);
        }

        return resultado.rows[0].nid_usuario;
    }

}