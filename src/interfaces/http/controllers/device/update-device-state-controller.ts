import { Request, Response } from 'express';
import { Logger } from '@utils/logger';
import { UseCase } from '@application/use-cases/use-case';
import { Device } from '@domain/models/device';
import { DeviceNotFoundError } from '@config/errors/device';

/**
 * @swagger
 * /device/{id}/state:
 *   patch:
 *     summary: Update the state of a device
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
 *               - state
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [AVAILABLE, IN_USE, INACTIVE]
 *                 description: New state of the device
 *     responses:
 *       200:
 *         description: Device state updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Bad request, failed to update device state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Device not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error during state update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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
      if (err instanceof DeviceNotFoundError) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(50).json({ error: 'Failed to update device state.' });
    }
  }
}
