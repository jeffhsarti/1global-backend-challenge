import { Request, Response } from 'express';
import { Logger } from '@utils/logger';
import { GetDevicesByQueryUseCase } from '@application/use-cases/device/get-devices-by-query-use-case';
import { DEVICE_STATE } from '@domain/enums/device-state';

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Fetch devices filtered by brand and/or state with pagination and sorting
 *     tags:
 *       - Device
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter devices by brand (optional, at least brand or state must be provided)
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, IN_USE, INACTIVE]
 *         description: Filter devices by state (optional, at least brand or state must be provided)
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number (must be a positive integer)
 *       - in: query
 *         name: count
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of devices per page (must be a positive integer)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [brand, name]
 *         description: Field to sort by (brand or name)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order (ASC or DESC)
 *     responses:
 *       200:
 *         description: List of devices filtered, paginated and sorted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       400:
 *         description: Validation error - missing required filters or invalid query params
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: At least one of "brand" or "state" must be provided
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
export class GetDevicesByQueryController {
  private logger = new Logger('GET_DEVICES_BY_QUERY_CONTROLLER');

  constructor(private readonly useCase: GetDevicesByQueryUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { count, page, sortBy, sortOrder, brand, state } = req.query;
      let parsedSortOrder: 'ASC' | 'DESC' | undefined;
      if (String(sortOrder).toLowerCase() === 'asc') {
        parsedSortOrder = 'ASC';
      } else if (String(sortOrder).toLowerCase() === 'desc') {
        parsedSortOrder = 'DESC';
      }
      const devices = await this.useCase.execute({
        brand: brand ? String(brand) : undefined,
        state: state ? (String(state) as DEVICE_STATE) : undefined,
        count: Number(count),
        page: Number(page),
        sortBy: String(sortBy),
        sortOrder: parsedSortOrder,
      });
      res.status(200).json(devices);
    } catch (err) {
      this.logger.error('Error fetching devices', err as Error);
      res.status(500).json({ err: 'Internal Server Error' });
    }
  }
}
