import { SecretProvider } from '../../../infrastructure/secrets/providers/secret-provider';
import { SecretManager } from '../../../infrastructure/secrets/secret-manager';
import { Logger } from '@utils/logger';

class MockSecretProvider implements SecretProvider {
  private secrets: Record<string, string> = {
    API_KEY: '12345',
    DB_PASSWORD: 'password',
  };

  getSecret(key: string): string {
    return this.secrets[key] || '';
  }

  _name = 'MockSecretProvider';
}

describe('SecretManager', () => {
  let secretManager: SecretManager;
  let mockProvider: MockSecretProvider;

  beforeAll(() => {
    process.env.DEBUG_MODE = 'true';
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    mockProvider = new MockSecretProvider();
    secretManager = new SecretManager(mockProvider);
  });

  it('should return the correct secret value', async () => {
    expect(await secretManager.get('API_KEY')).toBe('12345');
    expect(await secretManager.get('DB_PASSWORD')).toBe('password');
  });

  it('should return an empty string for a non-existent secret', async () => {
    expect(await secretManager.get('NON_EXISTENT')).toBe('');
  });

  it('should change the secret provider at runtime', () => {
    const debugSpy = jest.spyOn(Logger.prototype, 'debug');

    const newProvider = new MockSecretProvider();
    secretManager.setProvider(newProvider);

    expect(debugSpy).toHaveBeenCalledWith(
      'Secret provider changed from MockSecretProvider to MockSecretProvider',
    );
  });
});
