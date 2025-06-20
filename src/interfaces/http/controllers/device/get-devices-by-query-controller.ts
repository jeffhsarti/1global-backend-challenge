import { Request, Response } from 'express';
import { Logger } from '@utils/logger';
import { GetDevicesByQueryUseCase } from '@application/use-cases/device/get-devices-by-query-use-case';
import { DEVICE_STATE } from '@domain/enums/device-state';

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
