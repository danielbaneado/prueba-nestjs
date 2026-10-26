import { Config, configValues } from './config.keys.js';

// Re-exporta para que consumidores puedan importar `Config` y `ConfigService`
// desde un único módulo.
export { Config, configValues };

/**
 * Servicio de configuración tipado.
 *
 * Lee las variables de entorno desde `process.env` (cargadas por
 * `loadEnv()` en main.ts) y expone métodos tipados por el enum `Config`.
 *
 * No refleja toda la superficie de `process.env` como el implementation
 * original; solo permite acceder a las claves declaradas en `Config`.
 */
export class ConfigService {
  private readonly envConfig: Record<string, string | undefined>;

  constructor() {
    this.envConfig = { ...process.env };
  }

  /**
   * Devuelve el valor de una variable de entorno como `string` (puede ser `undefined`).
   * Usa `getOrThrow` cuando la variable es obligatoria.
   */
  get(key: Config): string | undefined {
    return this.envConfig[key];
  }

  /**
   * Devuelve el valor de una variable de entorno obligatoria.
   * Lanza un error descriptivo si no está definida o está vacía.
   */
  getOrThrow(key: Config): string {
    const value = this.envConfig[key];
    if (value === undefined || value === '') {
      throw new Error(`ConfigService: falta la variable de entorno "${key}"`);
    }
    return value;
  }

  /** Devuelve el valor como número, o `undefined` si no está definida. */
  getNumber(key: Config): number | undefined {
    const value = this.envConfig[key];
    if (value === undefined || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }

  /** Devuelve el valor como número obligatorio. */
  getNumberOrThrow(key: Config): number {
    const value = this.getNumber(key);
    if (value === undefined) {
      throw new Error(`ConfigService: la variable de entorno "${key}" no es un número válido`);
    }
    return value;
  }

  /** Devuelve el valor como booleano (case-insensitive). */
  getBoolean(key: Config): boolean {
    const value = this.envConfig[key];
    if (value === undefined || value === '') return false;
    return value.toLowerCase() === 'true';
  }
}