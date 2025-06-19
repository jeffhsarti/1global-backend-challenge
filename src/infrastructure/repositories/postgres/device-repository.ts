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
function mapToDevice(row: DeviceRow): Device {
  return new Device({
    id: row.id,
    name: row.name,
    brand: row.brand,
    state: mapToDeviceState(row.state),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  });
}

function mapToDeviceState(state: string): DEVICE_STATE {
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

    // Maps the database result to a domain entity.
    return mapToDevice(result.rows[0]);
  }

  async findById(id: string): Promise<Device | null> {
    const query = `SELECT * FROM devices.device WHERE id = $1`;
    const result = await this.pool.query<DeviceRow>(query, [id]);

    if (result.rows.length === 0) return null;
    return mapToDevice(result.rows[0]);
  }

  async update(device: Device): Promise<Device> {
    const query = `
      UPDATE devices.device
      SET name = $2, brand = $3, state = $4, "updatedAt" = $5
      WHERE id = $1
      RETURNING id, name, brand, state, "createdAt", "updatedAt"
    `;
    const params = [
      device.id,
      device.name,
      device.brand,
      device.state,
      device.updatedAt.toISOString(),
    ];
    const result = await this.pool.query<DeviceRow>(query, params);
    return mapToDevice(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      // In the future, we can add here more operations related to the device excluion flow
      await client.query(`DELETE FROM devices.device WHERE id = $1`, [id]);

      await client.query('COMMIT');
    } catch (error) {
      // If anything goes wrong, we rollback and we ensure that the device is still in the database.
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
