import { Pool } from 'pg';

export class UsuarioRepository {

    constructor(private readonly db: Pool) {}
    
    // consulta a la tabla USUARIOS
    async obtenerIdPorCorreo(correo: string): Promise<number> {

        const resultado = await this.db.query(
            `SELECT nid_usuario FROM usuarios WHERE semail = $1`,
            [correo]
        );

        if (resultado.rowCount === 0) {
            throw new Error(`No existe un usuario con el correo ${correo}`);
        }

        return resultado.rows[0].nid_usuario;
    }

    // consulta a la tabla PERSONAS
    async obtenerIdPersonaPorCorreo(correo: string): Promise<number> {

        const resultado = await this.db.query(
            `SELECT nid_persona
            FROM usuarios
            WHERE semail = $1`,
            [correo]
        );

        if (resultado.rowCount === 0) {
            throw new Error(`No existe un usuario con el correo ${correo}`);
        }

        return resultado.rows[0].nid_persona;
    }

    async obtenerNombrePersona(nidPersona: number): Promise<string> {

        const resultado = await this.db.query(
            `SELECT spersona_nombre
            FROM personas
            WHERE nid_persona = $1`,
            [nidPersona]
        );

        if (resultado.rowCount === 0) {
            throw new Error(`No existe una persona con nid_persona ${nidPersona}`);
        }

        return resultado.rows[0].spersona_nombre;
    }
}