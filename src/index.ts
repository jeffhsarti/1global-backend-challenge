import express, { Express } from 'express';
import dotenv from 'dotenv';

import { initializeDatabase } from '@infrastructure/database';
import { EnvSecretProvider } from '@infrastructure/secrets/implementations/env-secret-provider';
import { SecretManager } from '@infrastructure/secrets/secret-manager';
import makeHealthRouter from '@interfaces/http/routes/health';
import { Logger } from '@utils/logger';

dotenv.config();
const logger = new Logger('BOOTSTRAP');

async function bootstrap() {
  const app: Express = express();
  app.use(express.json());

  // Initialize SecretManager and Database Pool
  const secretManager = new SecretManager(new EnvSecretProvider());
  const pool = await initializeDatabase(secretManager);

  // Register routes
  const healthRouter = makeHealthRouter(pool);
  app.use('/health', healthRouter);

  // Start server
  const port = Number(await secretManager.get('PORT'));
  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to start application', err);
  process.exit(1);
});
