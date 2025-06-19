import { Request, Response } from 'express';
import { Logger } from '@utils/logger';
import { UseCase } from '@application/use-cases/use-case';
import { Device } from '@domain/models/device';
import { ForbiddenInUseDeviceOperation } from '@config/errors/device';

export class UpdateDeviceInfoController {
  private logger = new Logger('UPDATE_DEVICE_INFO_CONTROLLER');

  constructor(
    private readonly useCase: UseCase<
      Device,
      { id: string; name: string; brand: string }
    >,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, brand } = req.body;
      const updated = await this.useCase.execute({ id, name, brand });
      res.status(200).json(updated);
    } catch (err) {
      this.logger.error('Error updating name/brand', err as Error);
      if (err instanceof ForbiddenInUseDeviceOperation) {
        res.status(409).json({ error: err.message });
        return;
      }
      res.status(400).json({ error: 'Failed to update device name or brand.' });
    }
  }
}
