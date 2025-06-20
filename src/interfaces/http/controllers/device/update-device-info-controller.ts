import { Request, Response } from 'express';
import { Logger } from '@utils/logger';
import { UseCase } from '@application/use-cases/use-case';
import { Device } from '@domain/models/device';
import {
  DeviceNotFoundError,
  ForbiddenInUseDeviceOperation,
} from '@config/errors/device';

/**
 * @swagger
 * /device/{id}/info:
 *   patch:
 *     summary: Update device name and brand
 *     tags:
 *       - Device
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID of the device to update
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
 *               brand:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device updated successfully
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
 *       409:
 *         description: Device is in use and cannot be modified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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
      if (err instanceof DeviceNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(400).json({ error: 'Failed to update device name or brand.' });
    }
  }
}
