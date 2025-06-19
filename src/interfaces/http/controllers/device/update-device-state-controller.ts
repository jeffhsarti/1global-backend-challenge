import { Request, Response } from 'express';
import { Logger } from '@utils/logger';
import { UseCase } from '@application/use-cases/use-case';
import { Device } from '@domain/models/device';
import {
  DeviceNotFoundError,
  ForbiddenInUseDeviceOperation,
} from '@config/errors/device';

export class UpdateDeviceStateController {
  private logger = new Logger('UPDATE_STATE_CONTROLLER');

  constructor(
    private readonly useCase: UseCase<Device, { id: string; state: string }>,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { state } = req.body;
      const updated = await this.useCase.execute({ id, state });
      res.status(200).json(updated);
    } catch (err) {
      this.logger.error('Error updating state', err as Error);
      if (err instanceof ForbiddenInUseDeviceOperation) {
        res.status(409).json({ error: err.message });
        return;
      }
      if (err instanceof DeviceNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(400).json({ error: 'Failed to update device state.' });
    }
  }
}
