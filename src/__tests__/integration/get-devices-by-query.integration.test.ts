import express from 'express';
import request from 'supertest';
import { createTestPool } from '../helpers/test-db';
import makeDeviceRoute from '../../interfaces/http/routes/device';
import { DEVICE_STATE } from '@domain/enums/device-state';
import { PostgresDeviceRepository } from '@infrastructure/repositories/postgres/device-repository';

describe('GET /devices — success path', () => {
  let app: express.Express;

  beforeAll(async () => {
    const pool = createTestPool();
    // Mock the database initialization to use our in-memory pool
    jest
      .spyOn(require('../../infrastructure/database'), 'initializeDatabase')
      .mockResolvedValue(pool);

    // Prepopulate the database with test data
    await pool.query(`
    INSERT INTO devices.device (id, name, brand, state)
    VALUES
      ('00000000-0000-0000-0000-000000000001', 'Device A', 'Brand X', 'AVAILABLE'::devices.device_state),
      ('00000000-0000-0000-0000-000000000002', 'Device B', 'Brand Y', 'IN_USE'::devices.device_state),
      ('00000000-0000-0000-0000-000000000003', 'Device C', 'Brand X', 'INACTIVE'::devices.device_state);
  `);

    app = express();
    app.use(express.json());
    // Use the same bootstrap logic to initialize the app with our pool
    app.use(makeDeviceRoute(pool));
  });

  it('should return devices matching the query', async () => {
    const res = await request(app)
      .get('/devices')
      .query({
        brand: 'Brand X',
        page: 1,
        count: 10,
      })
      .expect(200);

    expect(res.body.devices).toHaveLength(2);
  });

  it('should return devices matching the query', async () => {
    const res = await request(app)
      .get('/devices')
      .query({
        state: DEVICE_STATE.IN_USE,
        page: 1,
        count: 10,
      })
      .expect(200);

    expect(res.body.devices).toHaveLength(1);
  });

  it('should return an empty array if no devices match the query', async () => {
    const res = await request(app)
      .get('/devices')
      .query({
        state: DEVICE_STATE.INACTIVE,
        brand: 'Nonexistent Brand',
        page: 1,
        count: 10,
      })
      .expect(200);

    expect(res.body.devices).toHaveLength(0);
  });

  it('should return devices matching the query (with sort)', async () => {
    const res = await request(app)
      .get('/devices')
      .query({
        state: DEVICE_STATE.IN_USE,
        page: 1,
        count: 10,
        sortBy: 'brand',
        sortOrder: 'ASC',
      })
      .expect(200);

    expect(res.body.devices).toHaveLength(1);
  });
});

describe('GET /devices — error path', () => {
  let app: express.Express;

  beforeAll(async () => {
    const pool = createTestPool();
    // Mock the database initialization to use our in-memory pool
    jest
      .spyOn(require('../../infrastructure/database'), 'initializeDatabase')
      .mockResolvedValue(pool);

    app = express();
    app.use(express.json());
    // Use the same bootstrap logic to initialize the app with our pool
    app.use(makeDeviceRoute(pool));
  });

  it('should return 500 if an unexpected error occurs', async () => {
    jest
      .spyOn(PostgresDeviceRepository.prototype, 'getByPaginatedQuery')
      .mockRejectedValueOnce(new Error('DB failure'));
    const res = await request(app).get('/devices').query({
      brand: 'Brand X',
      page: 1,
      count: 10,
    });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });

  it('should return 400 if the query is invalid (no state or brand)', async () => {
    const res = await request(app).get('/devices').query({
      page: 1,
      count: 10,
    });
    expect(res.status).toBe(400);
  });

  it('should return 400 if the query is invalid (state)', async () => {
    const res = await request(app).get('/devices').query({
      state: 'INVALID_STATE',
      page: 1,
      count: 10,
    });
    expect(res.status).toBe(400);
  });
  it('should return 400 if the query is invalid (invalid brand)', async () => {
    const res = await request(app).get('/devices').query({
      brand: '',
      page: 1,
      count: 10,
    });
    expect(res.status).toBe(400);
  });
});
