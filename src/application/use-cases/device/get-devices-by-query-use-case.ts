import { UseCase } from '../use-case';
import { Device } from '@domain/models/device';
import { DeviceRepository } from '@application/repositories/device-repository';
import { DEVICE_STATE } from '@domain/enums/device-state';
import { InvalidDeviceStateError } from '@config/errors/device';

interface GetDevicesByQueryInput {
  count: number;
  page: number;
  sortBy?: string;
  sortOrder?: 'DESC' | 'ASC';
  state?: DEVICE_STATE;
  brand?: string;
}

interface GetDevicesByQueryOutput {
  devices: Device[];
  metadata: {
    totalCount: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export class GetDevicesByQueryUseCase
  implements UseCase<GetDevicesByQueryOutput, GetDevicesByQueryInput>
{
  constructor(private readonly repository: DeviceRepository) {}

  /**
   * Executes the use case to retrieve devices based on a query.
   * @param input - The input data containing query parameters such as state, brand, and pagination.
   * @returns A promise that resolves to an array of devices matching the query.
   * This use case fetches devices from the repository that match the specified query parameters.
   */
  async execute(
    input: GetDevicesByQueryInput,
  ): Promise<GetDevicesByQueryOutput> {
    const stateFilter = [];

    if (input.state) {
      if (!Object.values(DEVICE_STATE).includes(input.state)) {
        throw new InvalidDeviceStateError(input.state);
      }
      stateFilter.push(input.state);
    } else {
      stateFilter.push(...Object.values(DEVICE_STATE));
    }

    const [devices, count] = await Promise.all([
      this.repository.getByPaginatedQuery(
        input.count,
        (input.page - 1) * input.count,
        input.sortBy ?? 'createdAt',
        input.sortOrder ?? 'ASC',
        stateFilter,
        input.brand,
      ),
      this.repository.countByQuery(stateFilter, input.brand),
    ]);
    return {
      devices,
      metadata: {
        totalCount: count,
        perPage: input.count,
        currentPage: input.page,
        totalPages: Math.ceil(count / input.count),
      },
    };
  }
}
