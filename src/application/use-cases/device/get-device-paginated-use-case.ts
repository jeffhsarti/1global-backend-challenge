import { UseCase } from '../use-case';
import { Device } from '@domain/models/device';
import { DeviceRepository } from '@application/repositories/device-repository';

interface GetDevicesPaginatedInput {
  count: number;
  page: number;
  sortBy?: string;
  sortOrder?: 'DESC' | 'ASC';
}

interface GetDevicesPaginatedOutput {
  devices: Device[];
  metadata: {
    totalCount: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export class GetDevicesPaginatedUseCase
  implements UseCase<GetDevicesPaginatedOutput, GetDevicesPaginatedInput>
{
  constructor(private readonly repository: DeviceRepository) {}

  /**
   * Executes the use case to retrieve a paginated list of devices.
   * @param input - The input data containing pagination and sorting parameters.
   * @returns A promise that resolves to an array of devices.
   * This use case fetches a paginated list of devices from the repository based on the provided parameters.
   */
  async execute(
    input: GetDevicesPaginatedInput,
  ): Promise<GetDevicesPaginatedOutput> {
    const [devices, count] = await Promise.all([
      this.repository.getAll(
        input.count,
        (input.page - 1) * input.count,
        input.sortBy ?? 'createdAt',
        input.sortOrder ?? 'ASC',
      ),
      this.repository.countAll(),
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
