/**
 * Catálogo tipado de todas las variables de entorno que usa la aplicación.
 *
 * Se usa con `ConfigService.get(Config.X)` para evitar strings mágicos y
 * obtener autocompletado en tiempo de desarrollo.
 *
 * El valor de cada enum es el nombre literal de la variable de entorno,
 * que debe coincidir con `.env.example`.
 */
export enum Config {
  // Base de datos (PostgreSQL)
  DB_CONTAINER_NAME = 'DB_CONTAINER_NAME',
  POSTGRES_USER = 'POSTGRES_USER',
  POSTGRES_PASSWORD = 'POSTGRES_PASSWORD',
  POSTGRES_DB = 'POSTGRES_DB',
  POSTGRES_PORT = 'POSTGRES_PORT',
  POSTGRES_HOST = 'POSTGRES_HOST',
  POSTGRES_HOST_PORT = 'POSTGRES_HOST_PORT',

  // CORS
  CORS_ORIGIN = 'CORS_ORIGIN',

  // Aplicación
  APP_CONTAINER_NAME = 'APP_CONTAINER_NAME',
  APP_PORT = 'APP_PORT',
  APP_URL = 'APP_URL',

  // JWT
  JWT_SECRET = 'JWT_SECRET',
  JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET',
  JWT_ACCESS_EXPIRES_IN = 'JWT_ACCESS_EXPIRES_IN',
  JWT_REFRESH_EXPIRES_IN = 'JWT_REFRESH_EXPIRES_IN',

  // Contraseñas / hashing
  SALT_ROUNDS = 'SALT_ROUNDS',

  // Límites de recursos (contenedores)
  DB_CPU_LIMIT = 'DB_CPU_LIMIT',
  DB_MEM_LIMIT = 'DB_MEM_LIMIT',
  APP_CPU_LIMIT = 'APP_CPU_LIMIT',
  APP_MEM_LIMIT = 'APP_MEM_LIMIT',

  // Entorno y logging
  NODE_ENV = 'NODE_ENV',
  LOG_LEVEL = 'LOG_LEVEL',

  // Seguridad de la cuenta
  MAX_FAILED_ATTEMPTS = 'MAX_FAILED_ATTEMPTS',

  // Integraciones externas
  API_KEY = 'API_KEY',

  // Fortaleza de contraseña (configurables por entorno)
  PASSWORD_MIN_LENGTH = 'PASSWORD_MIN_LENGTH',
  PASSWORD_REQUIRE_DIGIT = 'PASSWORD_REQUIRE_DIGIT',
  PASSWORD_REQUIRE_LOWER = 'PASSWORD_REQUIRE_LOWER',
  PASSWORD_REQUIRE_UPPER = 'PASSWORD_REQUIRE_UPPER',
  PASSWORD_REQUIRE_SPECIAL = 'PASSWORD_REQUIRE_SPECIAL',

  // Rate limiting (auth endpoints)
  RATE_LIMIT_AUTH_WINDOW_MS = 'RATE_LIMIT_AUTH_WINDOW_MS',
  RATE_LIMIT_AUTH_MAX = 'RATE_LIMIT_AUTH_MAX',

  // Rate limiting (global safety net)
  RATE_LIMIT_GLOBAL_WINDOW_MS = 'RATE_LIMIT_GLOBAL_WINDOW_MS',
  RATE_LIMIT_GLOBAL_MAX = 'RATE_LIMIT_GLOBAL_MAX',
}

/** Helper para iterar los valores de un enum de string. */
export const configValues = <T extends Record<string, string>>(e: T): Array<T[keyof T]> =>
  Object.values(e) as Array<T[keyof T]>;