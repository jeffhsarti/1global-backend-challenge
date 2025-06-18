export class SecretNotFoundError extends Error {
  constructor(secretName: string) {
    super(`Secret ${secretName} was not found.`);
    this.name = 'SecretNotFoundError';
  }
}
