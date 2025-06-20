import { Device } from '@domain/models/device';
import { UseCase } from '../use-case';
import { DeviceRepository } from '@application/repositories/device-repository';
import { DeviceNotFoundError } from '@config/errors/device';

export interface UpdateDeviceInfoInput {
  id: string;
  name: string;
  brand: string;
}

export class UpdateDeviceInfoUseCase
  implements UseCase<Device, UpdateDeviceInfoInput>
{
  constructor(private readonly repository: DeviceRepository) {}

  /**
   * Executes the use case to update the information of an existing device.
   * @param input - The input data containing the device ID, new name, and new brand.
   * @returns A promise that resolves to the updated device.
   * This use case updates the device's information, ensuring it is not in use.
   */
  async execute({ id, name, brand }: UpdateDeviceInfoInput): Promise<Device> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new DeviceNotFoundError(id);

    existing.updateInfo(name, brand);

    return await this.repository.update(existing);
  }
}
