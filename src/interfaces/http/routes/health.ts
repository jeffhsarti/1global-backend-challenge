import { Router } from 'express';
import { HealthCheckController } from '@interfaces/http/controllers/health/health-check-controller';
import { HealthCheckUseCase } from '@application/use-cases/health/health-check-use-case';
import { Pool } from 'pg';

export default function makeHealthRouter(pool: Pool) {
  const healthCheckUseCase = new HealthCheckUseCase(pool);
  const healthCheckController = new HealthCheckController(healthCheckUseCase);

  const router = Router();
  router.get(
    '/',
    healthCheckController.getHealthCheck.bind(healthCheckController),
  );
  return router;
}
