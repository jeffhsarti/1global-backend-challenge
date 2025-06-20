import request from 'supertest';
import express from 'express';
import makeDeviceRoute from '../../interfaces/http/routes/device';
import { createTestPool } from '../helpers/test-db';
import { PostgresDeviceRepository } from '@infrastructure/repositories/postgres/device-repository';
import { CreateDeviceUseCase } from '@application/use-cases/device/create-device-use-case';

/**
 * Integration tests for the Device API using pg-mem.
 * We could use a real testing database with docker-compose,
 * but for simplicity and the sake of this exercise, we'll use pg-mem.
 */

describe('GET /device/:id — success path', () => {
  let app: express.Express;
  let createdDeviceId: string;

  beforeAll(async () => {
    const pool = createTestPool();
    // monkey‑patch initializeDatabase to return our pool in‑mem
    jest
      .spyOn(require('../../infrastructure/database'), 'initializeDatabase')
      .mockResolvedValue(pool);

    const createDeviceUseCase = new CreateDeviceUseCase(
      new PostgresDeviceRepository(pool),
    );
    const device = await createDeviceUseCase.execute({
      name: 'X1',
      brand: 'ZBrand',
    });
    createdDeviceId = device.id;
    app = express();
    app.use(express.json());
    // using the same bootstrap logic to initialize the app with our pool
    app.use(makeDeviceRoute(pool));
  });

  it('should return 200 and the device if it exists', async () => {
    const res = await request(app).get(`/device/${createdDeviceId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: createdDeviceId,
        name: 'X1',
        brand: 'ZBrand',
        state: 'AVAILABLE',
      }),
    );
  });
});

describe('POST /device — error path', () => {
  let app: express.Express;

  beforeAll(() => {
    const pool = createTestPool();

    app = express();
    app.use(express.json());

    app.use(makeDeviceRoute(pool));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return 500 if an unexpected error occurs', async () => {
    jest
      .spyOn(PostgresDeviceRepository.prototype, 'findById')
      .mockRejectedValueOnce(new Error('DB failure'));
    const res = await request(app).get(
      '/device/11111111-1111-1111-1111-111111111111',
    );
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });

  it('should return 404 if the device is not found', async () => {
    const res = await request(app).get(
      '/device/00000000-0000-0000-0000-000000000000',
    );
    expect(res.status).toBe(404);
  });

  it('should return 400 if the id is not an uuid', async () => {
    const res = await request(app).get('/device/test-invalid-uuid');
    expect(res.status).toBe(400);
  });
});
