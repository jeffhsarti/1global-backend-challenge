import { InMemoryDeviceRepository } from '../../infrastructure/repositories/in-memory/device-repository';
import { CreateDeviceUseCase } from '../../application/use-cases/device/create-device-use-case';
import { DEVICE_STATE } from '../../domain/enums/device-state';

describe('CreateDeviceUseCase', () => {
  let repository: InMemoryDeviceRepository;
  let createDeviceUseCase: CreateDeviceUseCase;

  beforeEach(() => {
    repository = new InMemoryDeviceRepository();
    createDeviceUseCase = new CreateDeviceUseCase(repository);
  });

  it('should create a new device', async () => {
    const input = {
      name: 'New Device',
      brand: 'Brand A',
    };

    const device = await createDeviceUseCase.execute(input);

    expect(device).toBeDefined();
    expect(device.id).toBeDefined();
    expect(device.name).toBe(input.name);
    expect(device.brand).toBe(input.brand);
    expect(device.state).toBe(DEVICE_STATE.AVAILABLE);
  });
});
