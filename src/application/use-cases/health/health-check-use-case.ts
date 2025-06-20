import { HealthFeedback } from '@domain/enums/health-feedback';
import { HealthRepository } from '@application/repositories/health-repository';
import { UseCase } from '../use-case';
import {
  HEALTH_STATUS,
  DATABASE_CONNECTION_STATUS,
} from '@domain/enums/health-status';

export class HealthCheckUseCase implements UseCase<HealthFeedback> {
  constructor(private healthRepository: HealthRepository) {}

  /**
   * Executes the health check use case.
   * @returns A promise that resolves to the health feedback of the system.
   */
  async execute(): Promise<HealthFeedback> {
    const isDatabaseConnected =
      await this.healthRepository.checkDatabaseConnection();
    const databaseStatus = isDatabaseConnected
      ? DATABASE_CONNECTION_STATUS.CONNECTED
      : DATABASE_CONNECTION_STATUS.UNAVAILABLE;

    return {
      status: this.checkStatus(databaseStatus),
      metadata: {
        database: databaseStatus,
      },
    };
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
