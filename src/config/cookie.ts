import { Config, ConfigService } from './config.service.js';

/**
 * Opciones de cookie para el token de acceso (JWT).
 *
 * La duración del access token es de 15 minutos y debe coincidir con
 * JWT_ACCESS_EXPIRES_IN en el código que crea el token.
 *
 * `createCookieOptions` es una **factory** para que el valor de NODE_ENV
 * se lea después de que loadEnv() haya cargado .env (ver src/config/cors.ts).
 */

// Duración del access token: 15 minutos (debe coincidir con JWT_ACCESS_EXPIRES_IN)
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutos en milisegundos

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  maxAge: number;
}

export function createCookieOptions(configService = new ConfigService()): CookieOptions {
  const isProduction = configService.get(Config.NODE_ENV)?.toLowerCase() === 'production';

  return {
    httpOnly: true, // Cookie solo accesible por medio de peticiones HTTP, no JS
    secure: isProduction, // Si está en producción, solo es accesible por HTTPS
    sameSite: 'lax', // Previene envío en cross-site requests, manteniendo compatibilidad con navegación normal
    maxAge: ACCESS_TOKEN_MAX_AGE, // 15 minutos en milisegundos (coincide con la expiración del JWT)
  };
}