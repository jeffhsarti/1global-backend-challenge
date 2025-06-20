import request from 'supertest';
import express from 'express';
import makeDeviceRoute from '../../interfaces/http/routes/device';
import { createTestPool } from '../helpers/test-db';
import { PostgresDeviceRepository } from '@infrastructure/repositories/postgres/device-repository';

/**
 * Integration tests for the Device API using pg-mem.
 * We could use a real testing database with docker-compose,
 * but for simplicity and the sake of this exercise, we'll use pg-mem.
 */

describe('POST /device — success path', () => {
  let app: express.Express;

  beforeAll(() => {
    const pool = createTestPool();
    // monkey‑patch initializeDatabase to return our pool in‑mem
    jest
      .spyOn(require('../../infrastructure/database'), 'initializeDatabase')
      .mockResolvedValue(pool);

    app = express();
    app.use(express.json());
    // using the same bootstrap logic to initialize the app with our pool
    app.use(makeDeviceRoute(pool));
  });

  it('POST /device → 201 + body', async () => {
    const res = await request(app)
      .post('/device')
      .send({ name: 'X1', brand: 'ZBrand' })
      .expect(201);

    expect(res.body).toMatchObject({
      name: 'X1',
      brand: 'ZBrand',
      state: 'AVAILABLE',
    });
    expect(res.body.id).toBeDefined();
  });
});

describe('POST /device — error path', () => {
  let app: express.Express;

  beforeAll(() => {
    const pool = createTestPool();
    jest
      .spyOn(PostgresDeviceRepository.prototype, 'save')
      .mockRejectedValue(new Error('DB failure'));

    app = express();
    app.use(express.json());

    app.use(makeDeviceRoute(pool));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return 500 when repository.save throws', async () => {
    const res = await request(app)
      .post('/device')
      .send({ name: 'X-Error', brand: 'B-Error' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });
});
