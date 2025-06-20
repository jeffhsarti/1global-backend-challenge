import { Request, Response } from 'express';
import { GetDeviceByIdUseCase } from '@application/use-cases/device/get-device-by-id-use-case';
import { Logger } from '@utils/logger';
import { DeviceNotFoundError } from '@config/errors/device';

/**
 * @swagger
 * /device/{id}:
 *   get:
 *     summary: Get device by ID
 *     tags:
 *       - Device
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the device to retrieve
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Device found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Device not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: Internal Server Error
 */
export class GetDeviceByIdController {
  private logger = new Logger('GET_DEVICE_BY_ID_CONTROLLER');

  constructor(private readonly useCase: GetDeviceByIdUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const device = await this.useCase.execute({ id });
      res.status(200).json(device);
    } catch (err) {
      this.logger.error('Error fetching device by id', err as Error);
      if (err instanceof DeviceNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(500).json({ err: 'Internal Server Error' });
    }
  }
}
