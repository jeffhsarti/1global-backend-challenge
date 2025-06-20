import { EnvSecretProvider } from '../../../infrastructure/secrets/implementations/env-secret-provider';
import { SecretNotFoundError } from '@config/errors/secrets';

describe('EnvSecretProvider', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('should return the secret value from environment variables', () => {
    process.env.TEST_SECRET = 'secret_value';
    const provider = new EnvSecretProvider();

    const secret = provider.getSecret('TEST_SECRET');
    expect(secret).toBe('secret_value');
  });

  it('should throw SecretNotFoundError if the secret is not found', () => {
    const provider = new EnvSecretProvider();

    expect(() => provider.getSecret('NON_EXISTENT_SECRET')).toThrow(
      SecretNotFoundError,
    );
  });
});
