import { newDb, DataType } from 'pg-mem';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { Pool } from 'pg';

export function createTestPool(): Pool {
  const mem = newDb({ autoCreateForeignKeyIndices: true });

  // Registra gen_random_uuid (se precisar)
  mem.public.registerFunction({
    name: 'gen_random_uuid',
    returns: DataType.uuid,
    implementation: () => require('crypto').randomUUID(),
  });

  const sql = readFileSync(join(__dirname, './setup.sql'), 'utf8');
  mem.public.none(sql);

  const adapter = mem.adapters.createPg();
  const PgMemPoolClass = adapter.Pool;
  const poolInstance = new PgMemPoolClass() as unknown as Pool;

  return poolInstance;
}
