import { Router } from 'express';
import { Pool } from 'pg';

import { CreateDeviceController } from '@interfaces/http/controllers/device/create-device-controller';
import { UpdateDeviceStateController } from '../controllers/device/update-device-state-controller';
import { UpdateDeviceInfoController } from '../controllers/device/update-device-info-controller';

import { PostgresDeviceRepository } from '@infrastructure/repositories/postgres/device-repository';

import { UpdateDeviceInfoUseCase } from '@application/use-cases/device/update-device-info-use-case';
import { UpdateDeviceStateUseCase } from '@application/use-cases/device/update-device-state-use-case';
import { CreateDeviceUseCase } from '@application/use-cases/device/create-device-use-case';

import { validate } from '../middlewares/zod-validation';
import { createDeviceSchema } from '../schemas/device/create-device-schema';
import {
  idSchema,
  updateInfoSchema,
  updateStateSchema,
} from '../schemas/device/update-device-schema';

export default function makeDeviceRouter(pool: Pool) {
  const repository = new PostgresDeviceRepository(pool);

  const createDeviceUseCase = new CreateDeviceUseCase(repository);
  const createDeviceController = new CreateDeviceController(
    createDeviceUseCase,
  );

  const updateDeviceInfoUseCase = new UpdateDeviceInfoUseCase(repository);
  const updateDeviceInfoController = new UpdateDeviceInfoController(
    updateDeviceInfoUseCase,
  );

  const updateDeviceStateUseCase = new UpdateDeviceStateUseCase(repository);
  const updateDeviceStateController = new UpdateDeviceStateController(
    updateDeviceStateUseCase,
  );

  const router = Router();
  router.post(
    '/device',
    validate(createDeviceSchema),
    createDeviceController.handle.bind(createDeviceController),
  );
  router.patch(
    '/device/:id/info',
    validate(idSchema, 'params'),
    validate(updateInfoSchema),
    updateDeviceInfoController.handle.bind(updateDeviceInfoController),
  );
  router.patch(
    '/device/:id/state',
    validate(idSchema, 'params'),
    validate(updateStateSchema),
    updateDeviceStateController.handle.bind(updateDeviceStateController),
  );

  return router;
}
