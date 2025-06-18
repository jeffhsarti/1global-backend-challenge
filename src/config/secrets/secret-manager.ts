import { SecretProvider } from './providers/secret-provider';
import { Logger } from '@config/logger';

export class SecretManager {
  private provider: SecretProvider;
  private logger: Logger;
  /**
   * Initialize with a SecretProvider strategy
   * @param provider Strategy for fetching secrets
   */
  constructor(provider: SecretProvider) {
    this.provider = provider;
    this.logger = new Logger('SECRET_MANAGER');
  }

  /**
   * Get secret value by key, always returns a Promise
   * @param key The secret key
   */
  async get(key: string): Promise<string | null> {
    // Normalize both sync and async providers
    const result = this.provider.getSecret(key);
    this.logger.debug(`Secret ${key} requested`);
    return Promise.resolve(result);
  }

  /**
   * Change the provider at runtime
   * @param provider New secret provider strategy
   */
  setProvider(provider: SecretProvider): void {
    this.logger.debug(
      `Secret provider changed from ${this.provider._name} to ${provider._name}`,
    );
    this.provider = provider;
  }
}
