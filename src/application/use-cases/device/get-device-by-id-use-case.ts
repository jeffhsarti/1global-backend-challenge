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

  async execute(input: GetDeviceByIdInput): Promise<Device> {
    const device = await this.repository.findById(input.id);
    if (!device) throw new DeviceNotFoundError(input.id);
    return device;
  }
}
