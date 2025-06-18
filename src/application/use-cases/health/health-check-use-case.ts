import { Pool } from 'pg';
import { HealthFeedback } from '@domain/health/health-feedback';
import {
  HEALTH_STATUS,
  DATABASE_CONNECTION_STATUS,
} from '@config/enums/health';
import { UseCase } from '../use-case';

export class HealthCheckUseCase implements UseCase<HealthFeedback> {
  constructor(private pool: Pool) {}

  async execute(): Promise<HealthFeedback> {
    const databaseHealth = await this.checkDatabase();

    return {
      status: this.checkStatus(databaseHealth),
      metadata: {
        database: databaseHealth,
      },
    };
  }

  private async checkDatabase() {
    try {
      await this.pool.query('SELECT 1');
      return DATABASE_CONNECTION_STATUS.CONNECTED;
    } catch {
      return DATABASE_CONNECTION_STATUS.UNAVAILABLE;
    }
  }

  private checkStatus(
    databaseStatus: DATABASE_CONNECTION_STATUS,
  ): HEALTH_STATUS {
    return (
      (databaseStatus === DATABASE_CONNECTION_STATUS.CONNECTED &&
        HEALTH_STATUS.OK) ||
      HEALTH_STATUS.ERROR
    );
  }
}
