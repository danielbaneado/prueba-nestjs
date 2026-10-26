import { Injectable } from '@nestjs/common';
import { Config, ConfigService } from '../../config/config.service.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogMetadata = Record<string, unknown>;

const priorities: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const DEFAULT_LEVEL: LogLevel = 'info';

/**
 * Logger estructurado (JSON) de la aplicación.
 *
 * Se renombra a `AppLogger` para evitar colisión con el `Logger` de
 * `@nestjs/common` (que se usa en filtros y en main.ts).
 *
 * El nivel se configura por `LOG_LEVEL` (via ConfigService) y se puede
 * cambiar en runtime editando `this.minimumPriority`.
 */
@Injectable()
export class AppLogger {
  private minimumPriority: number;

  constructor(configService: ConfigService) {
    const raw = (configService.get(Config.LOG_LEVEL) || DEFAULT_LEVEL).toLowerCase();
    const level = (Object.keys(priorities) as LogLevel[]).includes(raw as LogLevel)
      ? (raw as LogLevel)
      : DEFAULT_LEVEL;
    this.minimumPriority = priorities[level];
  }

  private write(level: LogLevel, message: string, metadata: LogMetadata = {}): void {
    if (priorities[level] < this.minimumPriority) return;

    const entry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...metadata,
    });

    if (level === 'error') {
      console.error(entry);
    } else if (level === 'warn') {
      console.warn(entry);
    } else {
      console.log(entry);
    }
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.write('debug', message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.write('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.write('warn', message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.write('error', message, metadata);
  }

  /** Permite cambiar el nivel de log en runtime. */
  setLevel(level: LogLevel): void {
    this.minimumPriority = priorities[level] ?? priorities.info;
  }
}