import express, { Express } from 'express';
import dotenv from 'dotenv';

import { initializeDatabase } from '@infrastructure/database';
import { EnvSecretProvider } from '@infrastructure/secrets/implementations/env-secret-provider';
import { SecretManager } from '@infrastructure/secrets/secret-manager';
import makeHealthRouter from '@interfaces/http/routes/health';
import makeDeviceRoute from '@interfaces/http/routes/device';
import { Logger } from '@utils/logger';
import { routerLogger } from '@utils/express/routerLogger';

dotenv.config();
const logger = new Logger('BOOTSTRAP');

async function bootstrap() {
  const timeStart = new Date();
  logger.info('Bootstrapping started');
  const app: Express = express();
  app.use(express.json());

  // Initialize SecretManager and Database Pool
  logger.info('Initializing secret manager');
  const secretManager = new SecretManager(new EnvSecretProvider());

  logger.info('Initializing database connection');
  const pool = await initializeDatabase(secretManager);

  // Register routes
  logger.info('Registering routers');
  app.use(makeHealthRouter(pool));
  app.use(makeDeviceRoute(pool));

  // Start server
  logger.info('Starting the server');
  const port = Number(await secretManager.get('PORT'));
  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
    routerLogger(app);
  });
  logger.info('Bootstrapping ended');
  logger.info(
    `Booststrapping time: ${(new Date().getTime() - timeStart.getTime()) / 1000}s`,
  );
}

bootstrap().catch((err) => {
  logger.error('Failed to start application', err);
  process.exit(1);
});
