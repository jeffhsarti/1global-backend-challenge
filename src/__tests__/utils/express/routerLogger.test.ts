import express, { RequestHandler } from 'express';
import { routerLogger } from '@utils/express/routerLogger';

// Mock console.log to capture output
describe('routerLogger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let app: express.Express;

  beforeEach(() => {
    // Mock console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    // Create a fresh Express app for each test
    app = express();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should log a message when no routes are registered', () => {
    routerLogger(app);

    // Check that it logged the "no routes" message
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('No registered routes'),
    );
  });

  it('should log registered routes with correct formatting', () => {
    // Define a simple handler
    const handler: RequestHandler = (_req, res) => {
      res.send('Response');
    };

    // Set up some routes
    app.get('/users', handler);
    app.post('/users', handler);
    app.put('/users/:id', handler);
    app.delete('/users/:id', handler);

    routerLogger(app);

    // Check that it logged the header
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Registered routes'),
    );

    // Check that it logged each method
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('GET'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('POST'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('PUT'));
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('DELETE'),
    );

    // Check that it logged each path
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('/users/:id'),
    );
  });

  it('should handle nested routers correctly', () => {
    // Define a simple handler
    const handler: RequestHandler = (_req, res) => {
      res.send('Response');
    };

    // Create a nested router
    const userRouter = express.Router();
    userRouter.get('/', handler);
    userRouter.post('/', handler);
    userRouter.get('/:id', handler);

    // Mount the router
    app.use('/api/users', userRouter);

    routerLogger(app);

    // The actual output will have the paths without the prefix
    // because of how Express handles router mounting
    const calls = consoleLogSpy.mock.calls.join('\n');
    expect(calls).toMatch(/GET.*\//); // For the '/' route
    expect(calls).toMatch(/POST.*\//); // For the '/' route
    expect(calls).toMatch(/GET.*\/:id/); // For the '/:id' route
  });

  it('should handle routers with multiple HTTP methods on the same path', () => {
    // Define a simple handler
    const handler: RequestHandler = (_req, res) => {
      res.send('Response');
    };

    // Set up a route with multiple methods
    const router = express.Router();
    router.route('/profile').get(handler).put(handler).delete(handler);

    app.use('/api', router);

    routerLogger(app);

    // The actual output will have the paths without the prefix
    const calls = consoleLogSpy.mock.calls.join('\n');
    expect(calls).toMatch(/GET.*\/profile/);
    expect(calls).toMatch(/PUT.*\/profile/);
    expect(calls).toMatch(/DELETE.*\/profile/);
  });

  it('should handle app without router property', () => {
    // Create a mock app without router property
    const mockApp = {} as express.Express;

    routerLogger(mockApp);

    // Check that it logged the error message
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('No registered routes found'),
    );
  });

  it('should handle empty router stack', () => {
    // Create a mock app with empty router stack
    const mockApp = {
      _router: {
        stack: [],
      },
    } as unknown as express.Express;

    routerLogger(mockApp);

    // Check that it logged the "no routes" message
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('No registered routes'),
    );
  });
});
