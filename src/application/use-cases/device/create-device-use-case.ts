import { randomUUID } from 'crypto';
import { UseCase } from '../use-case';
import { Device } from '@domain/models/device';
import { DEVICE_STATE } from '@domain/enums/device-state';
import { DeviceRepository } from '@application/repositories/device-repository';

interface CreateDeviceInput {
  name: string;
  brand: string;
}

export class CreateDeviceUseCase implements UseCase<Device, CreateDeviceInput> {
  constructor(private readonly repository: DeviceRepository) {}

  /**
   * Executes the use case to create a new device.
   * @param input - The input data containing the name and brand of the device.
   * @returns A promise that resolves to the newly created device.
   * This use case handles the creation of a new device with the provided details.
   */
  async execute(input: CreateDeviceInput): Promise<Device> {
    const device = new Device({
      id: randomUUID(),
      name: input.name,
      brand: input.brand,
      state: DEVICE_STATE.AVAILABLE,
    });

    await this.repository.save(device);
    return device;
  }
}
