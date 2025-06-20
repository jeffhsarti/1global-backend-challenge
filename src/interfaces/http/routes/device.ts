import { Router } from 'express';
import { Pool } from 'pg';

import { CreateDeviceController } from '../controllers/device/create-device-controller';
import { UpdateDeviceStateController } from '../controllers/device/update-device-state-controller';
import { UpdateDeviceInfoController } from '../controllers/device/update-device-info-controller';
import { DeleteDeviceController } from '../controllers/device/delete-device-controller';

import { PostgresDeviceRepository } from '@infrastructure/repositories/postgres/device-repository';

import { UpdateDeviceInfoUseCase } from '@application/use-cases/device/update-device-info-use-case';
import { UpdateDeviceStateUseCase } from '@application/use-cases/device/update-device-state-use-case';
import { CreateDeviceUseCase } from '@application/use-cases/device/create-device-use-case';
import { DeleteDeviceUseCase } from '@application/use-cases/device/delete-device-use-case';

import { validate } from '../middlewares/zod-validation';
import { createDeviceSchema } from '../schemas/device/create-device-schema';
import {
  updateInfoSchema,
  updateStateSchema,
} from '../schemas/device/update-device-schema';
import { deviceIdSchema } from '../schemas/device/device-id-schema';
import { GetDeviceByIdUseCase } from '@application/use-cases/device/get-device-by-id-use-case';
import { GetDeviceByIdController } from '../controllers/device/get-device-by-id-controller';
import { GetDevicesPaginatedUseCase } from '@application/use-cases/device/get-device-paginated-use-case';
import { GetDevicePaginatedController } from '../controllers/device/get-device-paginated-controller';
import { paginatedDeviceSchema } from '../schemas/device/paginated-device-schema';

export default function makeDeviceRouter(pool: Pool) {
  const repository = new PostgresDeviceRepository(pool);

  const getDevicesPaginatedUseCase = new GetDevicesPaginatedUseCase(repository);
  const getDevicesPaginatedController = new GetDevicePaginatedController(
    getDevicesPaginatedUseCase,
  );

  const getDeviceByIdUseCase = new GetDeviceByIdUseCase(repository);
  const getDeviceByIdController = new GetDeviceByIdController(
    getDeviceByIdUseCase,
  );

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

  const deleteDeviceUseCase = new DeleteDeviceUseCase(repository);
  const deleteDeviceController = new DeleteDeviceController(
    deleteDeviceUseCase,
  );

  const router = Router();
  router.get(
    '/device',
    validate(paginatedDeviceSchema, 'query'),
    getDevicesPaginatedController.handle.bind(getDevicesPaginatedController),
  );
  router.get(
    '/device/:id',
    validate(deviceIdSchema, 'params'),
    getDeviceByIdController.handle.bind(getDeviceByIdController),
  );
  router.post(
    '/device',
    validate(createDeviceSchema),
    createDeviceController.handle.bind(createDeviceController),
  );
  router.patch(
    '/device/:id/info',
    validate(deviceIdSchema, 'params'),
    validate(updateInfoSchema),
    updateDeviceInfoController.handle.bind(updateDeviceInfoController),
  );
  router.patch(
    '/device/:id/state',
    validate(deviceIdSchema, 'params'),
    validate(updateStateSchema),
    updateDeviceStateController.handle.bind(updateDeviceStateController),
  );
  router.delete(
    '/device/:id',
    validate(deviceIdSchema, 'params'),
    deleteDeviceController.handle.bind(deleteDeviceController),
  );

  return router;
}
