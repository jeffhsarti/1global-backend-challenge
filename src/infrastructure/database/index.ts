import { Pool } from 'pg';
import { SecretManager } from '@infrastructure/secrets/secret-manager';
import { Logger } from '@utils/logger';

const logger = new Logger('DATABASE_CONNECTION');

/**
 * Initialize and configure a Postgres connection pool using secrets
 * @param secretManager Instance of SecretManager to fetch DB secrets
 */
export async function initializeDatabase(
  secretManager: SecretManager,
): Promise<Pool> {
  // Fetch configuration secrets (sync or async)
  const host = await secretManager.get('POSTGRES_HOST');
  const port = Number(await secretManager.get('POSTGRES_PORT'));
  const user = await secretManager.get('POSTGRES_USER');
  const password = await secretManager.get('POSTGRES_PASSWORD');
  const database = await secretManager.get('POSTGRES_DB');
  const max = Number(await secretManager.get('DB_POOL_MAX'));
  const idleTimeoutMillis = Number(await secretManager.get('DB_IDLE_TIMEOUT'));
  const connectionTimeoutMillis = Number(
    await secretManager.get('DB_CONN_TIMEOUT'),
  );

  const pool = new Pool({
    host,
    port,
    user,
    password,
    database,
    max,
    idleTimeoutMillis,
    connectionTimeoutMillis,
  });

  pool.on('connect', () => {
    logger.info('Postgres client connected');
  });

  pool.on('error', (err: Error) => {
    logger.error('Unexpected error on idle client', err);
  });

  pool.on('remove', () => {
    logger.info('Postgres client removed');
  });

  return pool;
}
