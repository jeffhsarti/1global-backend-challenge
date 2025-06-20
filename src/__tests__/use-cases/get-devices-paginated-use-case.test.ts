import { InMemoryDeviceRepository } from '../../infrastructure/repositories/in-memory/device-repository';
import { GetDevicesPaginatedUseCase } from '../../application/use-cases/device/get-device-paginated-use-case';
import { Device } from '../../domain/models/device';
import { randomUUID } from 'crypto';
import { DEVICE_STATE } from '@domain/enums/device-state';

describe('GetDevicesPaginatedUseCase', () => {
  let repository: InMemoryDeviceRepository;
  let getDevicesPaginatedUseCase: GetDevicesPaginatedUseCase;

  beforeEach(() => {
    repository = new InMemoryDeviceRepository();
    getDevicesPaginatedUseCase = new GetDevicesPaginatedUseCase(repository);
  });

  it('should return paginated devices', async () => {
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

    const result = await getDevicesPaginatedUseCase.execute({
      count: 5,
      page: 1,
      sortBy: 'name',
      sortOrder: 'DESC',
    });

    expect(result.devices.length).toBe(5);
    expect(result.devices[0].name).toBe('Device 9');
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

    const result = await getDevicesPaginatedUseCase.execute({
      count: 5,
      page: 1,
    });

    expect(result.devices.length).toBe(5);
    expect(result.devices[0].name).toBe('Device 0');
  });
});
