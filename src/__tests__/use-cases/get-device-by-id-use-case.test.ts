import { InMemoryDeviceRepository } from '../../infrastructure/repositories/in-memory/device-repository';
import { GetDeviceByIdUseCase } from '../../application/use-cases/device/get-device-by-id-use-case';
import { Device } from '../../domain/models/device';
import { randomUUID } from 'crypto';
import { DeviceNotFoundError } from '@config/errors/device';

describe('GetDeviceByIdUseCase', () => {
  let repository: InMemoryDeviceRepository;
  let getDeviceByIdUseCase: GetDeviceByIdUseCase;

  beforeEach(() => {
    repository = new InMemoryDeviceRepository();
    getDeviceByIdUseCase = new GetDeviceByIdUseCase(repository);
  });

  it('should return a device by its ID', async () => {
    const uuid = randomUUID();
    const device = new Device({
      id: uuid,
      name: 'Test Device',
      brand: 'Brand A',
    });

    await repository.save(device);

    const foundDevice = await getDeviceByIdUseCase.execute({ id: uuid });

    expect(foundDevice).toBeDefined();
    expect(foundDevice.id).toBe(uuid);
  });

  it('should throw an error if the device cannot be found', async () => {
    const nonExistentId = randomUUID();

    await expect(
      getDeviceByIdUseCase.execute({ id: nonExistentId }),
    ).rejects.toThrow(DeviceNotFoundError);
  });
});
