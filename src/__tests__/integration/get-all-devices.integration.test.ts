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

describe('GET /devices/all — success path', () => {
  let app: express.Express;

  beforeAll(() => {
    const pool = createTestPool();
    // monkey‑patch initializeDatabase to return our pool in‑mem
    jest
      .spyOn(require('../../infrastructure/database'), 'initializeDatabase')
      .mockResolvedValue(pool);

    const createDeviceUseCase = new CreateDeviceUseCase(
      new PostgresDeviceRepository(pool),
    );
    createDeviceUseCase.execute({ name: 'X1', brand: 'ZBrand' });
    app = express();
    app.use(express.json());
    // using the same bootstrap logic to initialize the app with our pool
    app.use(makeDeviceRoute(pool));
  });

  it('GET /devices/all → paginated without sort filters', async () => {
    const res = await request(app)
      .get('/devices/all?page=1&count=10')
      .expect(200);

    expect(res.body.devices).toBeDefined();
    expect(res.body.metadata).toBeDefined();
    expect(Array.isArray(res.body.devices)).toBeTruthy();
    expect(res.body.devices.length).toBeGreaterThan(0);
  });

  it('GET /devices/all → paginated with sort filters', async () => {
    const res = await request(app)
      .get('/devices/all?page=1&count=10&sortBy=name&sortOrder=ASC')
      .expect(200);

    expect(res.body.devices).toBeDefined();
    expect(res.body.metadata).toBeDefined();
    expect(Array.isArray(res.body.devices)).toBeTruthy();
    expect(res.body.devices.length).toBeGreaterThan(0);
  });

  it('GET /devices/all → paginated with partial sort filters (sortBy name)', async () => {
    const res = await request(app)
      .get('/devices/all?page=1&count=10&sortBy=name')
      .expect(200);

    expect(res.body.devices).toBeDefined();
    expect(res.body.metadata).toBeDefined();
    expect(Array.isArray(res.body.devices)).toBeTruthy();
    expect(res.body.devices.length).toBeGreaterThan(0);
  });

  it('GET /devices/all → paginated with partial sort filters (sortBy brand)', async () => {
    const res = await request(app)
      .get('/devices/all?page=1&count=10&sortBy=brand')
      .expect(200);

    expect(res.body.devices).toBeDefined();
    expect(res.body.metadata).toBeDefined();
    expect(Array.isArray(res.body.devices)).toBeTruthy();
    expect(res.body.devices.length).toBeGreaterThan(0);
  });

  it('GET /devices/all → paginated with partial sort filters (sortOrder ASC)', async () => {
    const res = await request(app)
      .get('/devices/all?page=1&count=10&sortOrder=ASC')
      .expect(200);

    expect(res.body.devices).toBeDefined();
    expect(res.body.metadata).toBeDefined();
    expect(Array.isArray(res.body.devices)).toBeTruthy();
    expect(res.body.devices.length).toBeGreaterThan(0);
  });

  it('GET /devices/all → paginated with partial sort filters (sortOrder DESC)', async () => {
    const res = await request(app)
      .get('/devices/all?page=1&count=10&sortOrder=DESC')
      .expect(200);

    expect(res.body.devices).toBeDefined();
    expect(res.body.metadata).toBeDefined();
    expect(Array.isArray(res.body.devices)).toBeTruthy();
    expect(res.body.devices.length).toBeGreaterThan(0);
  });
});

describe('GET /devices/all — error path', () => {
  let app: express.Express;

  beforeAll(() => {
    const pool = createTestPool();
    jest
      .spyOn(PostgresDeviceRepository.prototype, 'getAll')
      .mockRejectedValueOnce(new Error('DB failure'));

    app = express();
    app.use(express.json());

    app.use(makeDeviceRoute(pool));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return 500 when repository.getAll throws', async () => {
    const res = await request(app).get('/devices/all?page=1&count=10');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });

  it('should return 400 when query is invalid', async () => {
    const res = await request(app).get(
      '/devices/all?page=1&count=10?sortBy=invalid',
    );
    expect(res.status).toBe(400);
  });

  it('should return 400 when query is invalid', async () => {
    const res = await request(app).get(
      '/devices/all?page=1&count=10?sortOrder=invalid',
    );
    expect(res.status).toBe(400);
  });
});
