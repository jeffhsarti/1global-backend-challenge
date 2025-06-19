import { Router } from 'express';
import { Pool } from 'pg';
import { PostgresDeviceRepository } from '@infrastructure/repositories/postgres/device-repository';
import { CreateDeviceUseCase } from '@application/use-cases/device/create-device-use-case';
import { CreateDeviceController } from '@interfaces/http/controllers/device/create-device-controller';
import { validate } from '../middlewares/zod-validation';
import { createDeviceSchema } from '../schemas/device/create-device-schema';

export default function makeDeviceRouter(pool: Pool) {
  const repository = new PostgresDeviceRepository(pool);
  const createDeviceUseCase = new CreateDeviceUseCase(repository);
  const createDeviceController = new CreateDeviceController(
    createDeviceUseCase,
  );

  const router = Router();
  router.post(
    '/device',
    validate(createDeviceSchema),
    createDeviceController.handle.bind(createDeviceController),
  );

  return router;
}
