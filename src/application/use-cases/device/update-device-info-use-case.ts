import { Device } from '@domain/models/device';
import { UseCase } from '../use-case';
import { DeviceRepository } from '@application/repositories/device-repository';
import { DEVICE_STATE } from '@domain/enums/device-state';
import {
  DeviceNotFoundError,
  ForbiddenInUseDeviceOperation,
} from '@config/errors/device';

export interface UpdateDeviceInfoInput {
  id: string;
  name: string;
  brand: string;
}

export class UpdateDeviceInfoUseCase
  implements UseCase<Device, UpdateDeviceInfoInput>
{
  constructor(private readonly repository: DeviceRepository) {}

  async execute({ id, name, brand }: UpdateDeviceInfoInput): Promise<Device> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new DeviceNotFoundError(id);

    if (existing.state === DEVICE_STATE.IN_USE) {
      throw new ForbiddenInUseDeviceOperation('update');
    }

    existing.name = name;
    existing.brand = brand;
    existing.updateTimestamp();

    return await this.repository.update(existing);
  }
}
