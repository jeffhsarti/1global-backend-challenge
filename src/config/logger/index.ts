export class Logger {
  private static readonly LEVEL_PADDING = 5;

  /**
   * @param context Optional context or module name
   */
  constructor(private context?: string) {}

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    const ctx = this.context ? `[${this.context}]` : '';
    const levelName = level.toUpperCase();
    const paddedLevel = levelName.padEnd(Logger.LEVEL_PADDING, ' ');
    return `${timestamp} ${ctx} ${paddedLevel}: ${message}`;
  }

  info(message: string): void {
    console.info(this.formatMessage('info', message));
  }

  warn(message: string): void {
    console.warn(this.formatMessage('warn', message));
  }

  error(message: string, error?: Error): void {
    const msg = error
      ? `${message} - ${error.stack || error.message}`
      : message;
    console.error(this.formatMessage('error', msg));
  }

  debug(message: string): void {
    // You can control verbosity via env var
    if (process.env.DEBUG_MODE === 'true') {
      console.debug(this.formatMessage('debug', message));
    }
  }
}
