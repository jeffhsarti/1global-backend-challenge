import express from 'express';
import request from 'supertest';
import { createTestPool } from '../helpers/test-db';
import makeDeviceRoute from '../../interfaces/http/routes/device';
import { PostgresDeviceRepository } from '@infrastructure/repositories/postgres/device-repository';

/**
 * Integration tests for the Device API using pg-mem.
 * We use pg-mem to simulate a PostgreSQL database in memory for testing purposes.
 */

describe('DELETE /device/:id — success path', () => {
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

  it('should delete a device successfully', async () => {
    await request(app)
      .delete('/device/00000000-0000-0000-0000-000000000001')
      .expect(204);

    // Verify the device is deleted
    await request(app)
      .get('/device/00000000-0000-0000-0000-000000000001')
      .expect(404);
  });

  it('should return 409 if the device is in use', async () => {
    const res = await request(app)
      .delete('/device/00000000-0000-0000-0000-000000000002')
      .expect(409);

    expect(res.body).toEqual({
      error: 'Cannot delete device while state is IN_USE',
    });
  });
});

describe('DELETE /device/:id — error path', () => {
  let app: express.Express;

  beforeAll(async () => {
    const pool = createTestPool();
    await pool.query(`
      INSERT INTO devices.device (id, name, brand, state)
      VALUES
        ('00000000-0000-0000-0000-000000000001', 'Device A', 'Brand X', 'AVAILABLE'::devices.device_state);
    `);
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
      .spyOn(PostgresDeviceRepository.prototype, 'delete')
      .mockRejectedValueOnce(new Error('DB failure'));
    await request(app)
      .delete('/device/00000000-0000-0000-0000-000000000001')
      .expect(500);
    // The device should still exist after the error
    await request(app)
      .get('/device/00000000-0000-0000-0000-000000000001')
      .expect(200);
  });

  it('should return 404 if the device does not exist', async () => {
    await request(app)
      .delete('/device/00000000-0000-0000-0000-000000000003')
      .expect(404);
  });

  it('should return 400 if the id is not a valid UUID', async () => {
    await request(app).delete('/device/invalid-uuid').expect(400);
  });
});
