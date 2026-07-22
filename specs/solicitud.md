# Specs


# Instrucciones para el dominio de datos y archivos
1. Identifica las entradas dinámicas del código (correos, fechas, montos, motivos).
2. Si existe una estructura de datos reutilizable, llámala en el test; de lo contrario, agrégala en `data/` usando variables de `.env` para credenciales
3. **Manejo de Archivos/Adjuntos:** 
   - No uses rutas locales absolutas ni nombres de archivos volátiles como `1000310256.jpeg`.
   - Ubica los archivos de prueba en la carpeta `@data/assets/` 
   - Usa `path.join(__dirname, '/data/assets')` o resuelve la ruta relativa desde la raíz para asegurar compatibilidad cross-platform.

# Instrucciones para la arquitectura
1. Transforma este código en bruto a la arquitectura POM del proyecto.
2. Revisa los Page Objects en `@pages`. Si el locator ya existe en `loginPage.ts`, reutilízalo. Si es una pantalla nueva (ej. `tesoreriaPage.ts` para Tesorería/Gasto Alimentación), crea el Page Object y reexpórtalo en `pages/index.ts`.
3. Para la carga de archivos en el Page Object, crea un método como `subirComprobante(nombreArchivo: string)` que construya la ruta apuntando a la carpeta de assets.
4. Genera el test final en `tests/`.

# Generación del Test 
1. Ejecuta @playwright-test-planner y @playwright-test-generator y crea el archivo de prueba refactorizado en tests/[nombre-de-prueba].spec.ts. 
2. Utiliza las importaciones limpias de @pages y @data.

# Validación con Healer 
1. Ejecuta la nueva prueba usando la herramienta MCP de Playwright (npx playwright test) con @playwright-test-healer
2. Analiza errores y corrige la clase en pages/.
3. Repite el test hasta que pase en VERDE o identifiques un bug real de la aplicación.

# Criterio de Finalización 
1. NO ejecutes git commit ni git push.
2. Muestra en el chat un resumen de los archivos creados/modificados para mi revisión de conformidad.
