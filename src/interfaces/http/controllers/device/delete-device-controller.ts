import { Request, Response } from 'express';
import { UseCase } from '@application/use-cases/use-case';
import { Logger } from '@utils/logger';
import {
  DeviceNotFoundError,
  ForbiddenInUseDeviceOperation,
} from '@config/errors/device';

export class DeleteDeviceController {
  private readonly logger = new Logger('DELETE_DEVICE_CONTROLLER');

  constructor(
    private readonly deleteDeviceUseCase: UseCase<void, { id: string }>,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await this.deleteDeviceUseCase.execute({ id });
      res.status(204).send(); // No Content
    } catch (err) {
      this.logger.error('Error deleting device', err as Error);
      if (err instanceof ForbiddenInUseDeviceOperation) {
        res.status(409).json({ error: err.message });
        return;
      }
      if (err instanceof DeviceNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(500).json({
        error: 'Failed to delete device. It may still exist in the database.',
      });
    }
  }
}
