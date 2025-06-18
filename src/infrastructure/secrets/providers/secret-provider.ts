export interface SecretProvider {
  _name: string;
  /**
   * Get a secret by key (can be synchronous or asynchronous)
   * @param key The secret key
   */
  getSecret(key: string): string | Promise<string>;
}
