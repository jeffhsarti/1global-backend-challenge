import { Request, Response } from 'express';
import { CreateDeviceUseCase } from '@application/use-cases/device/create-device-use-case';
import { Logger } from '@utils/logger';

export class CreateDeviceController {
  private logger = new Logger('CREATE_DEVICE_CONTROLLER');

  constructor(private readonly useCase: CreateDeviceUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { name, brand } = req.body;
      const device = await this.useCase.execute({ name, brand });
      res.status(201).json(device);
    } catch (err) {
      this.logger.error('Error creating device', err as Error);
      res.status(500).json({ err: 'Internal Server Error' });
    }
  }
}
