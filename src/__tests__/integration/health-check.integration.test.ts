import express from 'express';
import request from 'supertest';
import makeHealthRouter from '../../interfaces/http/routes/health';
import { createTestPool } from '../helpers/test-db';

/**
 * Integration tests for the Health Check API using pg-mem.
 * We use pg-mem to simulate a PostgreSQL database in memory for testing purposes.
 */

describe('GET /health — success path', () => {
  let app: express.Express;

  beforeAll(async () => {
    const pool = createTestPool();

    app = express();
    app.use(express.json());
    app.use(makeHealthRouter(pool));
  });

  it('should return 200 and OK status when the database is connected', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.metadata.database).toBe('CONNECTED');
  });
});

describe('GET /health — error path', () => {
  let app: express.Express;
  let pool: any;

  beforeAll(async () => {
    pool = createTestPool();

    app = express();
    app.use(express.json());
    app.use(makeHealthRouter(pool));
  });

  it('should return 503 if the database is not connected', async () => {
    jest
      .spyOn(pool, 'query')
      .mockRejectedValueOnce(new Error('DB failure') as never);
    const res = await request(app).get('/health').expect(503);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.metadata.database).toBe('UNAVAILABLE');
  });
});
