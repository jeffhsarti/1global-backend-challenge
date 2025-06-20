import { DeviceRepository } from '@application/repositories/device-repository';
import { DEVICE_STATE } from '@domain/enums/device-state';
import { Device } from '@domain/models/device';

export class InMemoryDeviceRepository implements DeviceRepository {
  private devices: Device[] = [];

  async save(device: Device): Promise<Device> {
    this.devices.push(device);
    return device;
  }
  async findById(id: string): Promise<Device | null> {
    const device = this.devices.find((device) => device.id === id);
    return device || null;
  }

  async update(device: Device): Promise<Device> {
    const index = this.devices.findIndex((d) => d.id === device.id);
    if (index === -1) throw new Error('Device not found');
    this.devices[index] = device;
    return device;
  }

  async delete(id: string): Promise<void> {
    const index = this.devices.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Device not found');
    this.devices.splice(index, 1);
  }
  async getAll(
    limit: number,
    offset: number,
    orderBy: string,
    orderType: 'DESC' | 'ASC',
  ): Promise<Device[]> {
    const devices = this.sortDevices(orderBy, orderType);
    return devices.slice(offset, offset + limit);
  }
  async getByPaginatedQuery(
    limit: number,
    offset: number,
    orderBy: string,
    orderType: 'DESC' | 'ASC',
    state: DEVICE_STATE[],
    brand?: string,
  ): Promise<Device[]> {
    const devices = this.sortDevices(orderBy, orderType);
    return devices
      .filter((device) => {
        const stateFilter = state.length === 0 || state.includes(device.state);
        const brandFilter = brand ? device.brand === brand : true;
        return stateFilter && brandFilter;
      })
      .slice(offset, offset + limit);
  }
  async countAll(): Promise<number> {
    return this.devices.length;
  }
  async countByQuery(state: DEVICE_STATE[], brand?: string): Promise<number> {
    return this.devices.filter((device) => {
      const stateFilter = state.length === 0 || state.includes(device.state);
      const brandFilter = brand ? device.brand === brand : true;
      return stateFilter && brandFilter;
    }).length;
  }

  private sortDevices(orderBy: string, sortOrder: 'DESC' | 'ASC') {
    const sortedDevices = this.devices.sort((a: Device, b: Device) => {
      const sortBy = orderBy as keyof Device;
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (sortOrder === 'ASC') return aValue - bValue;
        if (sortOrder === 'DESC') return bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (sortOrder === 'ASC') return aValue.localeCompare(bValue);
        if (sortOrder === 'DESC') return bValue.localeCompare(aValue);
      }

      return 0;
    });
    return sortedDevices;
  }
}
