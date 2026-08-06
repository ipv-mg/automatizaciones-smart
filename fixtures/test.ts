import { test as base, expect } from '@playwright/test';
import { pool, cerrarPool } from '@db/database';
import { UsuarioRepository } from '@repositories/usuarioRepository';
import { Pool } from 'pg';

type DatabaseFixtures = { 
  db: Pool;
  usuarioRepository: UsuarioRepository;
};

export const test = base.extend<DatabaseFixtures>({

  db: async ({}, use) => { 
    await use(pool); 
  },

  usuarioRepository: async ({ db }, use) => {
    await use(new UsuarioRepository(db));
  },

});

export { expect };

test.afterAll(async () => {
  await cerrarPool();
});