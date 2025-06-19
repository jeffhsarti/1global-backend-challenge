import { Device } from '@domain/models/device';
import { UseCase } from '../use-case';
import { DeviceRepository } from '@application/repositories/device-repository';
import { DEVICE_STATE } from '@domain/enums/device-state';
import { DeviceNotFoundError } from '@config/errors/device';

export interface UpdateDeviceStateInput {
  id: string;
  state: DEVICE_STATE;
}

export class UpdateDeviceStateUseCase
  implements UseCase<Device, UpdateDeviceStateInput>
{
  constructor(private readonly repository: DeviceRepository) {}

  async execute({ id, state }: UpdateDeviceStateInput): Promise<Device> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new DeviceNotFoundError(id);

    existing.state = state;
    existing.updateTimestamp();

    return await this.repository.update(existing);
  }
}
