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

  /**
   * Executes the use case to update the state of an existing device.
   * @param input - The input data containing the device ID and new state.
   * @returns A promise that resolves to the updated device.
   * This use case changes the device's state and updates the timestamp.
   */
  async execute({ id, state }: UpdateDeviceStateInput): Promise<Device> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new DeviceNotFoundError(id);

    existing.updateState(state);

    return await this.repository.update(existing);
  }
}
