# Automatizaciones Smart

Repositorio de automatizaciones con Playwright para validar flujos clave de negocio.

## Estructura del proyecto

- `tests/`: suites ejecutables de Playwright.
- `tests/seed.spec.ts`: archivo base para preparar contexto de uso con agents.
- `specs/`: planes y documentación de escenarios de prueba.
- `documentos/`: guías internas y documentación complementaria.

## Requisitos

- Node.js 18 o superior
- `pnpm` o `npx`
- Navegador Chromium para Playwright

## Preparación rápida

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Instalar Chromium:
   ```bash
   npx playwright install chromium
   ```

## Ejecución

### Ejecutar toda la suite
```bash
npx playwright test
```

### Ejecutar una prueba puntual
```bash
npx playwright test tests/permisos/solicitud-horas.spec.ts
```

### Modo UI
```bash
npx playwright test --ui --project=chromium
```

## Playwright Agents

Para dejar el entorno listo con agentes en VS Code, ejecuta una sola vez:

```bash
npx playwright init-agents --loop=vscode
```

La configuración MCP queda en `.vscode/mcp.json` y el contexto base se usa desde `tests/seed.spec.ts`.

## Generador de codigo

```bash
npx playwright codegen
```