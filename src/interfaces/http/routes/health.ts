import { Router } from 'express';
import { HealthCheckController } from '@interfaces/http/controllers/health/health-check-controller';
import { HealthCheckUseCase } from '@application/use-cases/health/health-check-use-case';
import { Pool } from 'pg';
import { PostgresHealthRepository } from '@infrastructure/repositories/postgres/health-repository';

export default function makeHealthRouter(pool: Pool) {
  const repository = new PostgresHealthRepository(pool);
  const healthCheckUseCase = new HealthCheckUseCase(repository);
  const healthCheckController = new HealthCheckController(healthCheckUseCase);

  const router = Router();
  router.get(
    '/health',
    healthCheckController.handle.bind(healthCheckController),
  );
  return router;
}
