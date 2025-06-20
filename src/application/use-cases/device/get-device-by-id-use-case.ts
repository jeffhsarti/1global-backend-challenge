import { UseCase } from '../use-case';
import { Device } from '@domain/models/device';
import { DeviceRepository } from '@application/repositories/device-repository';
import { DeviceNotFoundError } from '@config/errors/device';

interface GetDeviceByIdInput {
  id: string;
}

export class GetDeviceByIdUseCase
  implements UseCase<Device, GetDeviceByIdInput>
{
  constructor(private readonly repository: DeviceRepository) {}

  /**
   * Executes the use case to retrieve a device by its ID.
   * @param input - The input data containing the device ID.
   * @returns A promise that resolves to the device with the specified ID.
   * This use case fetches the device details from the repository using the provided ID.
   */
  async execute(input: GetDeviceByIdInput): Promise<Device> {
    const device = await this.repository.findById(input.id);
    if (!device) throw new DeviceNotFoundError(input.id);
    return device;
  }
}
