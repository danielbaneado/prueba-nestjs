import type { CorsOptions } from 'cors';
import corsFactory from 'cors';
import type { Request, Response, NextFunction } from 'express';
import { Config, ConfigService } from './config.service.js';

/**
 * Lee la lista de orígenes permitidos de forma **lazy** (por request), no al
 * importar el módulo. Esto es crucial porque `loadEnv()` se ejecuta en main.ts
 * *después* de que los imports estáticos se han evaluado; si leéramos
 * `process.env` aquí arriba, CORS siempre usaría el fallback.
 */
function resolveAllowedOrigins(configService: ConfigService): string[] {
  const raw = configService.get(Config.CORS_ORIGIN) || 'http://localhost:5173';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function createCorsOptions(configService = new ConfigService()): CorsOptions {
  return {
    credentials: true,
    origin(origin, callback) {
      // !origin: peticiones sin Origin header (curl, server-to-server, same-origin).
      if (!origin || resolveAllowedOrigins(configService).includes(origin)) {
        callback(null, true);
        return;
      }

      // Rechazo limpio como 403 (no un Error que termine en 500).
      callback(new Error('Origen no permitido por CORS'));
    },
  };
}

/**
 * Wrapper alrededor del middleware `cors` que intercepta el Error lanzado por
 * `corsOptions.origin` y lo convierte en una respuesta HTTP 403 consistente,
 * en lugar de dejar que el AllExceptionsFilter lo trate como un error interno (500).
 */
export function createCorsMiddleware(configService = new ConfigService()) {
  const corsMiddleware = corsFactory(createCorsOptions(configService));

  return (req: Request, res: Response, next: NextFunction): void => {
    corsMiddleware(req, res, (err?: unknown) => {
      if (err instanceof Error && err.message === 'Origen no permitido por CORS') {
        res.status(403).json({
          statusCode: 403,
          message: err.message,
          error: 'Forbidden',
        });
        return;
      }
      next(err);
    });
  };
}