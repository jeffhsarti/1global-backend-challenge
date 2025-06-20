import express from 'express';
import request from 'supertest';
import { swaggerRoute } from '@interfaces/http/routes/swagger-route';

describe('Swagger Route Integration', () => {
  let app: express.Express;

  beforeEach(() => {
    // Create a fresh Express app for each test
    app = express();
    app.use(swaggerRoute);
  });

  it('should serve Swagger UI at /docs endpoint', async () => {
    // quick note: if the uri doesn't have the trailing slash, it might return 301.
    // apparently, swagger-ui-express automatically redirects to /docs/ if it doesn't have the trailing slash
    // lol
    // PS: this is the most random comment I've ever written in my life.
    await request(app).get('/docs/').expect(200);
  });

  it('should serve Swagger UI static assets', async () => {
    await request(app).get('/docs/swagger-ui.css').expect(200);
  });
});
