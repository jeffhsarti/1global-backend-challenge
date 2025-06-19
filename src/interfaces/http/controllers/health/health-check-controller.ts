import { Request, Response } from 'express';
import { UseCase } from '@application/use-cases/use-case';
import { HealthFeedback } from '@domain/enums/health-feedback';
import { Logger } from '@utils/logger';
import { HEALTH_STATUS } from '@domain/enums/health-status';

export class HealthCheckController {
  private logger: Logger;

  constructor(private healthCheckUseCase: UseCase<HealthFeedback>) {
    this.logger = new Logger('HEALTH_CHECK_CONTROLLER');
  }

  async handle(_: Request, res: Response) {
    const result = await this.healthCheckUseCase.execute();
    const code = result.status === HEALTH_STATUS.OK ? 200 : 503;
    this.logger.info(`Health check result: ${JSON.stringify(result)}`);
    res.status(code).json(result);
  }
}
