import express from 'express';
import request from 'supertest';
import { createTestPool } from '../helpers/test-db';
import makeDeviceRoute from '../../interfaces/http/routes/device';
import { PostgresDeviceRepository } from '@infrastructure/repositories/postgres/device-repository';

describe('PATCH /device/:id/info — success path', () => {
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

  it('should update device info successfully', async () => {
    const res = await request(app)
      .patch('/device/00000000-0000-0000-0000-000000000001/info')
      .send({ name: 'Updated Device A', brand: 'Updated Brand X' })
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Updated Device A',
        brand: 'Updated Brand X',
      }),
    );
  });

  it('should return 409 if the device is in use', async () => {
    await request(app)
      .patch('/device/00000000-0000-0000-0000-000000000002/info')
      .send({ name: 'Updated Device B', brand: 'Updated Brand Y' })
      .expect(409);
  });
});

describe('PATCH /device/:id/info — error path', () => {
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
      .patch('/device/00000000-0000-0000-0000-000000000001/info')
      .send({ name: 'Updated Device', brand: 'Updated Brand' })
      .expect(500);
  });

  it('should return 404 if the device does not exist', async () => {
    await request(app)
      .patch('/device/00000000-0000-0000-0000-000000000003/info')
      .send({ name: 'Nonexistent Device', brand: 'Nonexistent Brand' })
      .expect(404);
  });

  it('should return 400 if the id is not a valid UUID', async () => {
    await request(app)
      .patch('/device/invalid-uuid/info')
      .send({ name: 'Invalid Device', brand: 'Invalid Brand' })
      .expect(400);
  });

  it('should return 400 if the request body is invalid', async () => {
    await request(app)
      .patch('/device/00000000-0000-0000-0000-000000000001/info')
      .send({ name: '', brand: '' })
      .expect(400);
  });
});
