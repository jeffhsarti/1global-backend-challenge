import { Pool } from 'pg';
import { HealthRepository } from '@application/repositories/health-repository';

export class PostgresHealthRepository implements HealthRepository {
  constructor(private readonly pool: Pool) {}

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
