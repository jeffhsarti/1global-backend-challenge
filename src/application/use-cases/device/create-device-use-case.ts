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
