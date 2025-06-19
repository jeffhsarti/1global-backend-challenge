import { Device } from '@domain/models/device';

export interface DeviceRepository {
  save(device: Device): Promise<Device>;
  findById(id: string): Promise<Device | null>;
  update(device: Device): Promise<Device>;
}
