import { InMemoryDeviceRepository } from '../../infrastructure/repositories/in-memory/device-repository';
import { DeleteDeviceUseCase } from '../../application/use-cases/device/delete-device-use-case';
import { Device } from '../../domain/models/device';
import { DEVICE_STATE } from '../../domain/enums/device-state';
import { randomUUID } from 'crypto';
import {
  DeviceNotFoundError,
  ForbiddenInUseDeviceOperation,
} from '@config/errors/device';

describe('DeleteDeviceUseCase', () => {
  let repository: InMemoryDeviceRepository;
  let deleteDeviceUseCase: DeleteDeviceUseCase;

  beforeEach(() => {
    repository = new InMemoryDeviceRepository();
    deleteDeviceUseCase = new DeleteDeviceUseCase(repository);
  });

  it('should delete an existing device', async () => {
    const uuid = randomUUID();
    const device = new Device({
      id: uuid,
      name: 'Device to Delete',
      brand: 'Brand A',
      state: DEVICE_STATE.AVAILABLE,
    });

    await repository.save(device);

    await deleteDeviceUseCase.execute({ id: uuid });

    const foundDevice = await repository.findById(uuid);
    expect(foundDevice).toBeNull();
  });

  it('should throw an error if the device does not exist', async () => {
    await expect(
      deleteDeviceUseCase.execute({ id: 'non-existent-id' }),
    ).rejects.toThrow(DeviceNotFoundError);
  });

  it('should throw an error if the device is in use', async () => {
    const uuid = randomUUID();
    const device = new Device({
      id: uuid,
      name: 'Device in Use',
      brand: 'Brand B',
      state: DEVICE_STATE.IN_USE,
    });

    await repository.save(device);

    await expect(deleteDeviceUseCase.execute({ id: uuid })).rejects.toThrow(
      ForbiddenInUseDeviceOperation,
    );
  });
});
