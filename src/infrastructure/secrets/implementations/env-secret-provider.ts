import { SecretNotFoundError } from '@config/errors/secrets';
import { SecretProvider } from '../providers/secret-provider';

export class EnvSecretProvider implements SecretProvider {
  _name = 'EnvSecretProvider';
  getSecret(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new SecretNotFoundError(key);
    }
    return value;
  }
}
