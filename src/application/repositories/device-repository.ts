import { Device } from '@domain/models/device';

export interface DeviceRepository {
  save(device: Device): Promise<Device>;
}
