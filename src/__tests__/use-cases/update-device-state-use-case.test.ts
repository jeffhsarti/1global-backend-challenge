import { InMemoryDeviceRepository } from '../../infrastructure/repositories/in-memory/device-repository';
import { UpdateDeviceStateUseCase } from '../../application/use-cases/device/update-device-state-use-case';
import { DEVICE_STATE } from '../../domain/enums/device-state';
import { Device } from '../../domain/models/device';
import { randomUUID } from 'crypto';
import { DeviceNotFoundError } from '@config/errors/device';

describe('UpdateDeviceStateUseCase', () => {
  let repository: InMemoryDeviceRepository;
  let updateDeviceStateUseCase: UpdateDeviceStateUseCase;

  beforeEach(() => {
    repository = new InMemoryDeviceRepository();
    updateDeviceStateUseCase = new UpdateDeviceStateUseCase(repository);
  });

  it('should update the state of an existing device', async () => {
    const uuid = randomUUID();
    const device = new Device({
      id: uuid,
      name: 'Existing Device',
      brand: 'Brand A',
      state: DEVICE_STATE.AVAILABLE,
    });

    await repository.save(device);

    const input = {
      id: uuid,
      state: DEVICE_STATE.IN_USE,
    };

    const updatedDevice = await updateDeviceStateUseCase.execute(input);

    expect(updatedDevice.state).toBe(DEVICE_STATE.IN_USE);
  });

  it('should throw an error if the device does not exist', async () => {
    const input = {
      id: 'non-existent-id',
      state: DEVICE_STATE.IN_USE,
    };

    await expect(updateDeviceStateUseCase.execute(input)).rejects.toThrow(
      DeviceNotFoundError,
    );
  });
});
