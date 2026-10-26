import type { Request, Response, NextFunction } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { Config, ConfigService } from './config.service.js';

/**
 * Configuración de rate limiting.
 *
 * Se aplican dos límites:
 * - `authLimiter`: protege endpoints sensibles (login, registro, reset, captcha).
 *   Es el más estricto y es configurable por entorno.
 * - `globalLimiter`: safety net global para toda la app.
 *
 * Ambos se construyen con `createRateLimiter` (factory) para que los valores
 * de env se lean después de `loadEnv()`.
 */

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string | object;
  standardHeaders: 'draft-6' | 'draft-7' | 'draft-8' | true;
  legacyHeaders: boolean;
}

/** Genera un middleware de rate limit a partir de una config. */
export function createRateLimiter(config: RateLimitConfig) {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    message: config.message,
    standardHeaders: config.standardHeaders,
    legacyHeaders: config.legacyHeaders,
    // Clave por IP+route (no solo IP) para que un atacante no bloquee
    // una IP usada por muchos usuarios legítimos detrás de un proxy.
    keyGenerator: (req: Request) =>
      ipKeyGenerator(req.ip ?? req.socket.remoteAddress ?? 'unknown'),
    // No limitar healthchecks o swagger UI internos.
    skip: (req: Request) => req.path === '/health' || req.path.startsWith('/api/docs'),
    handler: (req: Request, res: Response, _next: NextFunction) => {
      res.status(429).json({
        statusCode: 429,
        message: config.message,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    },
  });
}

/**
 * Configuración del rate limiter para endpoints de autenticación.
 * Defaults: 15 min window, 5 intentos.
 */
export function createAuthLimiter(configService = new ConfigService()): ReturnType<typeof createRateLimiter> {
  const windowMs = configService.getNumber(Config.RATE_LIMIT_AUTH_WINDOW_MS) ?? 15 * 60 * 1000;
  const max = configService.getNumber(Config.RATE_LIMIT_AUTH_MAX) ?? 5;

  return createRateLimiter({
    windowMs,
    max,
    message: 'Demasiados intentos. Inténtalo de nuevo dentro de algunos minutos.',
    standardHeaders: true,
    legacyHeaders: false,
  });
}

/**
 * Configuración del rate limiter global (safety net).
 * Defaults: 1 min window, 100 requests por IP.
 */
export function createGlobalLimiter(configService = new ConfigService()): ReturnType<typeof createRateLimiter> {
  const windowMs = configService.getNumber(Config.RATE_LIMIT_GLOBAL_WINDOW_MS) ?? 60 * 1000;
  const max = configService.getNumber(Config.RATE_LIMIT_GLOBAL_MAX) ?? 100;

  return createRateLimiter({
    windowMs,
    max,
    message: 'Demasiadas peticiones. Inténtalo de nuevo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
  });
}