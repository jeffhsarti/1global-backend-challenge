import { Request, Response } from 'express';
import { Logger } from '@utils/logger';
import { GetDevicesPaginatedUseCase } from '@application/use-cases/device/get-device-paginated-use-case';

export class GetDevicePaginatedController {
  private logger = new Logger('GET_DEVICE_BY_ID_CONTROLLER');

  constructor(private readonly useCase: GetDevicesPaginatedUseCase) {}

  async handle(req: Request, res: Response) {
    try {
      const { count, page, sortBy, sortOrder } = req.query;
      let parsedSortOrder: 'ASC' | 'DESC' | undefined;
      if (String(sortOrder).toLowerCase() === 'asc') {
        parsedSortOrder = 'ASC';
      } else if (String(sortOrder).toLowerCase() === 'desc') {
        parsedSortOrder = 'DESC';
      }
      const devices = await this.useCase.execute({
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
