import { Request, Response } from 'express';
import { Logger } from '@utils/logger';
import { GetDevicesPaginatedUseCase } from '@application/use-cases/device/get-device-paginated-use-case';
import { parseSortOrder } from '@utils/parsers/sort-order';

/**
 * @swagger
 * /devices/all:
 *   get:
 *     summary: Get paginated list of devices
 *     tags:
 *       - Device
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (must be >= 1)
 *       - in: query
 *         name: count
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of items per page (must be >= 1)
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [brand, name]
 *         description: Field to sort by (brand or name)
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (ASC or DESC)
 *     responses:
 *       200:
 *         description: List of devices paginated
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
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
export class GetDevicePaginatedController {
  private logger = new Logger('GET_DEVICE_BY_ID_CONTROLLER');

  constructor(private readonly useCase: GetDevicesPaginatedUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { count, page, sortBy, sortOrder } = req.query;
      const parsedSortOrder = parseSortOrder(sortOrder);
      const devices = await this.useCase.execute({
        count: Number(count),
        page: Number(page),
        sortBy: sortBy ? String(sortBy) : undefined,
        sortOrder: parsedSortOrder,
      });
      res.status(200).json(devices);
    } catch (err) {
      this.logger.error('Error fetching devices', err as Error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
