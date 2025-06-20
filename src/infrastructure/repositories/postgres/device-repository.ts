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

  private validateSortOrderParameter(sortOrder: string): void {
    const allowedSortOrder = ['ASC', 'DESC'];
    if (!allowedSortOrder.includes(sortOrder)) {
      throw new Error(`Invalid sortOrder: ${sortOrder}`);
    }
  }
  private validateSortByParameter(sortBy: string): void {
    const validOrderFields = ['name', 'brand', 'createdAt'];
    if (!validOrderFields.includes(sortBy)) {
      throw new Error(`Invalid sortBy field: ${sortBy}`);
    }
  }

  async getByPaginatedQuery(
    limit: number,
    offset: number,
    sortBy: string,
    sortOrder: 'DESC' | 'ASC',
    state: DEVICE_STATE[],
    brand?: string,
  ): Promise<Device[]> {
    this.validateSortByParameter(sortBy);
    this.validateSortOrderParameter(sortOrder);

    let paramIndex = 1;
    const params: any[] = [];

    // Adiciona os estados dinamicamente como $1, $2, ...
    const statePlaceholders = state.map(() => `$${paramIndex++}`).join(', ');
    params.push(...state);

    let query = `
    SELECT *
    FROM devices.device
    WHERE state IN (${statePlaceholders})
  `;

    if (brand) {
      query += ` AND brand = $${paramIndex++}`;
      params.push(brand);
    }

    // Adiciona limit e offset ao final
    query += ` ORDER BY "${sortBy}" ${sortOrder} LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(limit, offset);
    const result = await this.pool.query(query, params);
    return result.rows.map(mapToDevice);
  }

  async countByQuery(state: DEVICE_STATE[], brand?: string): Promise<number> {
    let query = `
      SELECT COUNT(*) FROM devices.device
      WHERE state = ANY($1::devices.device_state[])
    `;

    const params: any[] = [state];

    if (brand) {
      params.push(brand);
      query += ` AND brand = $${params.length}`;
    }

    const result = await this.pool.query<{ count: string }>(query, params);
    return Number(result.rows[0].count);
  }

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

  async getAll(
    limit: number,
    offset: number,
    sortBy: string,
    sortOrder: 'DESC' | 'ASC',
  ): Promise<Device[]> {
    this.validateSortByParameter(sortBy);
    this.validateSortOrderParameter(sortOrder);

    const query = `
      SELECT id, name, brand, state, "createdAt", "updatedAt"
      FROM devices.device
      ORDER BY "${sortBy}" ${sortOrder}
      LIMIT $1 OFFSET $2
    `;

    const result = await this.pool.query(query, [limit, offset]);
    return result.rows.map(mapToDevice);
  }

  async countAll(): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      `SELECT COUNT(*) FROM devices.device`,
    );
    return Number(result.rows[0].count);
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
