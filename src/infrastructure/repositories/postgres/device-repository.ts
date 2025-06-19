import { DeviceRepository } from '@application/repositories/device-repository';
import { DEVICE_STATE } from '@domain/enums/device-state';
import { Device } from '@domain/models/device';
import { Pool } from 'pg';

interface DeviceRow {
  id: string;
  name: string;
  brand: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export class PostgresDeviceRepository implements DeviceRepository {
  constructor(private readonly pool: Pool) {}

  async save(device: Device): Promise<Device> {
    const query = `INSERT INTO devices.device(id, name, brand, state, "createdAt", "updatedAt")
      VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, brand, state, "createdAt", "updatedAt"`;
    const params = [
      device.id,
      device.name,
      device.brand,
      device.state,
      device.createdAt.toISOString(),
      device.updatedAt.toISOString(),
    ];
    const result = await this.pool.query<DeviceRow>(query, params);
    const row = result.rows[0];

    // Maps the database result to a domain entity.
    /**
     * It's a common practice to implement simple mappers
     * inside the repository, since the repository should
     * know the domain. But, it is important to abstract
     * that logic if the mapper starts to grow in size or
     * complexity (for example, complex transformations,
     * additional validations, nested fields) or if we had
     * other repositories that depend on the same mapping
     * strategy (for better reuse and testability).
     */
    const createdDevice = new Device({
      id: row.id,
      name: row.name,
      brand: row.brand,
      state: this.mapToDeviceState(row.state),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    });

    return createdDevice;
  }

  private mapToDeviceState(state: string): DEVICE_STATE {
    switch (state) {
      case DEVICE_STATE.AVAILABLE:
        return DEVICE_STATE.AVAILABLE;
      case DEVICE_STATE.IN_USE:
        return DEVICE_STATE.IN_USE;
      case DEVICE_STATE.INACTIVE:
        return DEVICE_STATE.INACTIVE;
      default:
        throw new Error(`Unknown device state from DB: ${state}`);
    }
  }
}
