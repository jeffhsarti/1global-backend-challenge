import express from 'express';
import request from 'supertest';
import { createTestPool } from '../helpers/test-db';
import makeDeviceRoute from '../../interfaces/http/routes/device';
import { PostgresDeviceRepository } from '@infrastructure/repositories/postgres/device-repository';

/**
 * Integration tests for the Device API using pg-mem.
 * We use pg-mem to simulate a PostgreSQL database in memory for testing purposes.
 */

describe('PATCH /device/:id/state — success path', () => {
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
        ('00000000-0000-0000-0000-000000000002', 'Device B', 'Brand Y', 'IN_USE'::devices.device_state);
    `);

    app = express();
    app.use(express.json());
    // Use the same bootstrap logic to initialize the app with our pool
    app.use(makeDeviceRoute(pool));
  });

  it('should update device state successfully', async () => {
    await request(app)
      .patch('/device/00000000-0000-0000-0000-000000000001/state')
      .send({ state: 'IN_USE' })
      .expect(200);
  });

  it('should update device state successfully even if the state is IN_USE', async () => {
    await request(app)
      .patch('/device/00000000-0000-0000-0000-000000000002/state')
      .send({ state: 'AVAILABLE' })
      .expect(200);
  });
});

describe('PATCH /device/:id/state — error path', () => {
  let app: express.Express;

  beforeAll(async () => {
    const pool = createTestPool();
    // Mock the database initialization to use our in-memory pool
    jest
      .spyOn(require('../../infrastructure/database'), 'initializeDatabase')
      .mockResolvedValue(pool);

    await pool.query(`
      INSERT INTO devices.device (id, name, brand, state)
      VALUES
        ('00000000-0000-0000-0000-000000000001', 'Device A', 'Brand X', 'AVAILABLE'::devices.device_state);
    `);

    app = express();
    app.use(express.json());
    // Use the same bootstrap logic to initialize the app with our pool
    app.use(makeDeviceRoute(pool));
  });

  it('should return 500 if an unexpected error occurs', async () => {
    jest
      .spyOn(PostgresDeviceRepository.prototype, 'update')
      .mockRejectedValueOnce(new Error('DB failure'));
    await request(app)
      .patch('/device/00000000-0000-0000-0000-000000000001/state')
      .send({ state: 'INACTIVE' })
      .expect(500);
  });

  it('should return 404 if the device does not exist', async () => {
    await request(app)
      .patch('/device/00000000-0000-0000-0000-000000000003/state')
      .send({ state: 'INACTIVE' })
      .expect(404);
  });

  it('should return 400 if the id is not a valid UUID', async () => {
    await request(app)
      .patch('/device/invalid-uuid/state')
      .send({ state: 'INACTIVE' })
      .expect(400);
  });

  it('should return 400 if the request body is invalid', async () => {
    await request(app)
      .patch('/device/00000000-0000-0000-0000-000000000001/state')
      .send({ state: 'INVALID_STATE' })
      .expect(400);
  });
});
