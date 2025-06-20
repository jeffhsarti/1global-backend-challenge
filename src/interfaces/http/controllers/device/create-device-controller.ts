import { Request, Response } from 'express';
import { CreateDeviceUseCase } from '@application/use-cases/device/create-device-use-case';
import { Logger } from '@utils/logger';

/**
 * @swagger
 * /device:
 *   post:
 *     summary: Create a new device
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *             properties:
 *               name:
 *                 type: string
 *                 description: Device name
 *                 example: My Device
 *               brand:
 *                 type: string
 *                 description: Device brand
 *                 example: Samsung
 *     responses:
 *       201:
 *         description: Device created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       500:
 *         description: Internal server error
 */

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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
