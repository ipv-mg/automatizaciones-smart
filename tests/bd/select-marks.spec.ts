import { test, expect } from '../../fixtures/dbFixture';

test.describe('test de conexion a bbdd', () => {

  test('select sobre la tabla marks', async ({ db }) => {
    // funcion query de db para incluir la consulta
    const resultado = await db.query('SELECT * FROM marks LIMIT 10;');

    // imprimimos lo que almacena "resultado"
    console.log('----------------------------------------------------');
    console.log(`Filas recuperadas de 'marks': ${resultado.rowCount}`);
    console.log('Primeros registros:', resultado.rows);


    // 3. Afirmación (Assert): Validar que el objeto devuelto no sea nulo/indefinido
    expect(resultado).toBeDefined();
    expect(resultado.rows).toBeInstanceOf(Array);
  });

});