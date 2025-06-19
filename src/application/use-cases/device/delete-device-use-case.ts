import { UseCase } from '@application/use-cases/use-case';
import { DeviceRepository } from '@application/repositories/device-repository';
import {
  DeviceNotFoundError,
  ForbiddenInUseDeviceOperation,
} from '@config/errors/device';
import { DEVICE_STATE } from '@domain/enums/device-state';

interface DeleteDeviceInput {
  id: string;
}

export class DeleteDeviceUseCase implements UseCase<void, DeleteDeviceInput> {
  constructor(private readonly repository: DeviceRepository) {}

  async execute({ id }: DeleteDeviceInput): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new DeviceNotFoundError(id);

    if (existing.state === DEVICE_STATE.IN_USE) {
      throw new ForbiddenInUseDeviceOperation('delete');
    }
    await this.repository.delete(id);
  }
}
