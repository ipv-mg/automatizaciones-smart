import { test as base } from '@playwright/test';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// instancia que conecta a la bbdd
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'test_db',
  password: process.env.DB_PASSWORD || 'secret',
  port: Number(process.env.DB_PORT) || 5432,

  ssl: {
    rejectUnauthorized: false 
  }

});

// extensión al test base de Playwright inyectando el fixture 'db'
export const test = base.extend<{ db: Pool }>({
  db: async ({}, use) => {
    // pasa el pool de conexiones al test
    await use(pool);
  },
});

export { expect } from '@playwright/test';