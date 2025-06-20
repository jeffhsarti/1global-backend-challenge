import { InMemoryDeviceRepository } from '../../infrastructure/repositories/in-memory/device-repository';
import { UpdateDeviceInfoUseCase } from '../../application/use-cases/device/update-device-info-use-case';
import { Device } from '../../domain/models/device';
import { DEVICE_STATE } from '../../domain/enums/device-state';
import { randomUUID } from 'crypto';
import {
  DeviceNotFoundError,
  ForbiddenInUseDeviceOperation,
} from '@config/errors/device';

describe('UpdateDeviceInfoUseCase', () => {
  let repository: InMemoryDeviceRepository;
  let updateDeviceInfoUseCase: UpdateDeviceInfoUseCase;

  beforeEach(() => {
    repository = new InMemoryDeviceRepository();
    updateDeviceInfoUseCase = new UpdateDeviceInfoUseCase(repository);
  });

  it('should update the name and brand of an existing device', async () => {
    const uuid = randomUUID();
    const device = new Device({
      id: uuid,
      name: 'Old Device Name',
      brand: 'Old Brand',
      state: DEVICE_STATE.AVAILABLE,
    });

    await repository.save(device);

    const input = {
      id: uuid,
      name: 'New Device Name',
      brand: 'New Brand',
    };

    const updatedDevice = await updateDeviceInfoUseCase.execute(input);

    expect(updatedDevice.name).toBe('New Device Name');
    expect(updatedDevice.brand).toBe('New Brand');
  });

  it('should throw an error if the device does not exist', async () => {
    const input = {
      id: 'non-existent-id',
      name: 'New Device Name',
      brand: 'New Brand',
    };

    await expect(updateDeviceInfoUseCase.execute(input)).rejects.toThrow(
      DeviceNotFoundError,
    );
  });

  it('should throw an error if the device is in use', async () => {
    const uuid = randomUUID();
    const device = new Device({
      id: uuid,
      name: 'Device In Use',
      brand: 'Brand B',
      state: DEVICE_STATE.IN_USE,
    });

    await repository.save(device);

    const input = {
      id: uuid,
      name: 'New Device Name',
      brand: 'New Brand',
    };

    await expect(updateDeviceInfoUseCase.execute(input)).rejects.toThrow(
      ForbiddenInUseDeviceOperation,
    );
  });
});
