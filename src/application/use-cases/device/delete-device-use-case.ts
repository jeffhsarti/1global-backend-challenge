import { UseCase } from '@application/use-cases/use-case';
import { DeviceRepository } from '@application/repositories/device-repository';
import {
  DeviceNotFoundError,
  ForbiddenInUseDeviceOperation,
} from '@config/errors/device';

interface DeleteDeviceInput {
  id: string;
}

export class DeleteDeviceUseCase implements UseCase<void, DeleteDeviceInput> {
  constructor(private readonly repository: DeviceRepository) {}

  /**
   * Executes the use case to delete a device by its ID.
   * @param input - The input data containing the device ID.
   * @returns A promise that resolves when the device is successfully deleted.
   * This use case deletes the device from the repository if it is eligible for deletion.
   */
  async execute({ id }: DeleteDeviceInput): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new DeviceNotFoundError(id);

    if (!existing.canDelete()) {
      throw new ForbiddenInUseDeviceOperation('delete');
    }
    await this.repository.delete(id);
  }
}
