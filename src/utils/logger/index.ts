import chalk, { Chalk } from 'chalk';

export class Logger {
  private static readonly LEVEL_PADDING = 7;
  private static readonly LEVEL_COLORS: Record<string, Chalk> = {
    INFO: chalk.blue,
    WARN: chalk.yellow,
    ERROR: chalk.red,
    DEBUG: chalk.magenta,
  };

  /**
   * @param context Optional context or module name
   */
  constructor(private context?: string) {}

  private formatMessage(level: string, message: string): string {
    const levelName = level.toUpperCase();

    const colorizer = Logger.LEVEL_COLORS[levelName] || chalk.white;

    const timestamp = chalk.gray(new Date().toISOString());
    const ctx = this.context ? chalk.cyan(`[${this.context}]`) : '';
    const paddedLevel = levelName.padEnd(Logger.LEVEL_PADDING, ' ');

    const coloredLevel = colorizer.bold(` ${paddedLevel} `);
    const coloredMessage = colorizer(message);

    return `${timestamp} ${ctx} ${coloredLevel} ${coloredMessage}`;
  }

  info(message: string): void {
    console.info(this.formatMessage('info', message));
  }

  warn(message: string): void {
    console.warn(this.formatMessage('warn', message));
  }

  error(message: string, error?: Error): void {
    const msg = error ? `${message}\n${error.stack || error.message}` : message;
    console.error(this.formatMessage('error', msg));
  }

  debug(message: string): void {
    // You can control verbosity via env var
    if (process.env.DEBUG_MODE === 'true') {
      console.debug(this.formatMessage('debug', message));
    }
  }
}
