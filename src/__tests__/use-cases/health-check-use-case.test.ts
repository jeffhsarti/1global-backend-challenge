import { HealthCheckUseCase } from '@application/use-cases/health/health-check-use-case';
import { HealthFeedback } from '@domain/enums/health-feedback';
import {
  DATABASE_CONNECTION_STATUS,
  HEALTH_STATUS,
} from '@domain/enums/health-status';
import { Pool } from 'pg';
import { PostgresHealthRepository } from '@infrastructure/repositories/postgres/health-repository';
import { HealthRepository } from '@application/repositories/health-repository';

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return {
    Pool: jest.fn(() => mPool),
  };
});

describe('HealthCheckUseCase', () => {
  let pool: Pool;
  let healthRepository: HealthRepository;
  let useCase: HealthCheckUseCase;

  beforeEach(() => {
    pool = new Pool();
    healthRepository = new PostgresHealthRepository(pool);
    useCase = new HealthCheckUseCase(healthRepository);
    jest.clearAllMocks();
  });

  it('should return OK status when the database is connected', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ result: 1 }] });

    const result: HealthFeedback = await useCase.execute();

    expect(result.status).toBe(HEALTH_STATUS.OK);
    expect(result.metadata.database).toBe(DATABASE_CONNECTION_STATUS.CONNECTED);
    expect(pool.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('should return ERROR status when the database is unavailable', async () => {
    (pool.query as jest.Mock).mockRejectedValueOnce(
      new Error('Database error'),
    );

    const result: HealthFeedback = await useCase.execute();

    expect(result.status).toBe(HEALTH_STATUS.ERROR);
    expect(result.metadata.database).toBe(
      DATABASE_CONNECTION_STATUS.UNAVAILABLE,
    );
    expect(pool.query).toHaveBeenCalledWith('SELECT 1');
  });
});
