import { Pool } from 'pg';
import { HealthFeedback } from '@domain/enums/health-feedback';
import {
  HEALTH_STATUS,
  DATABASE_CONNECTION_STATUS,
} from '@domain/enums/health-status';
import { UseCase } from '../use-case';

export class HealthCheckUseCase implements UseCase<HealthFeedback> {
  constructor(private pool: Pool) {}

  /**
   * Executes the health check use case.
   * @returns A promise that resolves to the health feedback of the system.
   */
  async execute(): Promise<HealthFeedback> {
    const databaseHealth = await this.checkDatabase();

    return {
      status: this.checkStatus(databaseHealth),
      metadata: {
        database: databaseHealth,
      },
    };
  }

  /**
   * Checks the status of the database connection.
   * @returns A promise that resolves to the database connection status.
   */
  private async checkDatabase() {
    try {
      await this.pool.query('SELECT 1');
      return DATABASE_CONNECTION_STATUS.CONNECTED;
    } catch {
      return DATABASE_CONNECTION_STATUS.UNAVAILABLE;
    }
  }

  /**
   * Determines the overall health status based on the database status.
   * @param databaseStatus - The current status of the database connection.
   * @returns The overall health status of the system.
   */
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
