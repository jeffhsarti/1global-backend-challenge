import { InMemoryDeviceRepository } from '../../infrastructure/repositories/in-memory/device-repository';
import { GetDevicesByQueryUseCase } from '../../application/use-cases/device/get-devices-by-query-use-case';
import { Device } from '../../domain/models/device';
import { DEVICE_STATE } from '../../domain/enums/device-state';
import { randomUUID } from 'crypto';
import { InvalidDeviceStateError } from '@config/errors/device';

describe('GetDevicesByQueryUseCase', () => {
  let repository: InMemoryDeviceRepository;
  let getDevicesByQueryUseCase: GetDevicesByQueryUseCase;

  beforeEach(() => {
    repository = new InMemoryDeviceRepository();
    getDevicesByQueryUseCase = new GetDevicesByQueryUseCase(repository);
  });

  it('should return devices matching the query', async () => {
    const devices = [
      new Device({
        id: randomUUID(),
        name: 'Device 1',
        brand: 'Brand A',
        state: DEVICE_STATE.AVAILABLE,
      }),
      new Device({
        id: randomUUID(),
        name: 'Device 2',
        brand: 'Brand B',
        state: DEVICE_STATE.IN_USE,
      }),
    ];

    for (const device of devices) {
      await repository.save(device);
    }

    const result = await getDevicesByQueryUseCase.execute({
      count: 10,
      page: 1,
      sortBy: 'name',
      sortOrder: 'ASC',
      state: DEVICE_STATE.AVAILABLE,
      brand: 'Brand A',
    });

    expect(result.devices.length).toBe(1);
    expect(result.devices[0].name).toBe('Device 1');
  });

  it('should return devices using default filters', async () => {
    const devices = [
      new Device({
        id: randomUUID(),
        name: 'Device 1',
        brand: 'Brand A',
        state: DEVICE_STATE.AVAILABLE,
      }),
      new Device({
        id: randomUUID(),
        name: 'Device 2',
        brand: 'Brand B',
        state: DEVICE_STATE.IN_USE,
      }),
    ];

    for (const device of devices) {
      await repository.save(device);
    }

    const result1 = await getDevicesByQueryUseCase.execute({
      count: 10,
      page: 1,
      sortBy: 'name',
      sortOrder: 'ASC',
      state: DEVICE_STATE.AVAILABLE,
      brand: 'Brand A',
    });

    expect(result1.devices.length).toBe(1);
    expect(result1.devices[0].name).toBe('Device 1');

    const result2 = await getDevicesByQueryUseCase.execute({
      count: 10,
      page: 1,
      sortBy: 'name',
      sortOrder: 'ASC',
      brand: 'Brand B',
    });

    expect(result2.devices.length).toBe(1);
    expect(result2.devices[0].name).toBe('Device 2');
  });

  it('should return paginated devices with default params', async () => {
    const devices = Array.from(
      { length: 10 },
      (_, i) =>
        new Device({
          id: randomUUID(),
          name: `Device ${i}`,
          brand: 'Brand A',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * i),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * i),
          state: DEVICE_STATE.AVAILABLE,
        }),
    );

    for (const device of devices) {
      await repository.save(device);
    }

    const result = await getDevicesByQueryUseCase.execute({
      count: 5,
      page: 1,
      brand: 'Brand A',
    });

    expect(result.devices.length).toBe(5);
    expect(result.devices[0].name).toBe('Device 0');
  });

  it('should throw an error if the given state is invalid', async () => {
    await expect(
      getDevicesByQueryUseCase.execute({
        count: 5,
        page: 1,
        state: 'invalid-state' as DEVICE_STATE,
      }),
    ).rejects.toThrow(InvalidDeviceStateError);
  });
});
