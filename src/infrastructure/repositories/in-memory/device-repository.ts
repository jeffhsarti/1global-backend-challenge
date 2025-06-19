import { DeviceRepository } from '@application/repositories/device-repository';
import { Device } from '@domain/models/device';

export class InMemoryDeviceRepository implements DeviceRepository {
  private devices: Device[] = [];

  async save(device: Device): Promise<Device> {
    this.devices.push(device);
    return device;
  }
}
