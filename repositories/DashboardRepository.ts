import { Pool } from 'pg';

export interface DashboardExtempMarks {
    nid_colaborador: number;
    snombres_apellidos: string;
    snombre_colaborador: string;
    ntotal_dias_laborados: number;
    dfecha_inicio: string;
    dfecha_fin: string;
    nsin_marcas: number;
    ndias_normal: number;
    nmarcas_extemp: number;
    ntotal_solicitudes: number;
    nsolicitudes_aprobadas: number;
    nsolicitudes_pendientes: number;
    nestado_colaborador: number;
}

export class DashboardRepository {

    constructor(private readonly db: Pool) {}

    async obtenerIndicadoresMarcasExtemporaneas(
        nombrePersona: string,
        fechaInicio: string,
        fechaFin: string
    ): Promise<DashboardExtempMarks> {

        const resultado = await this.db.query(
            `SELECT *
             FROM fn_smart_extemp_marks_dashboard(
                NULL,
                'INDICADORES-MODULO-COLABORADORES',
                $1::date,
                $2::date,
                $3,
                '',
                '1'
             )`,
            [fechaInicio, fechaFin, nombrePersona]
        );

        if (resultado.rowCount === 0) {
            throw new Error(
                `No se encontraron indicadores para ${nombrePersona}`
            );
        }

        return resultado.rows[0];
    }
}