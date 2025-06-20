import { Device } from '@domain/models/device';

export interface DeviceRepository {
  save(device: Device): Promise<Device>;
  findById(id: string): Promise<Device | null>;
  update(device: Device): Promise<Device>;
  delete(id: string): Promise<void>;
  getAll(
    limit: number,
    offset: number,
    orderBy: string,
    orderType: 'DESC' | 'ASC',
  ): Promise<Device[]>;
  countAll(): Promise<number>;
}
