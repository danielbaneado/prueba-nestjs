import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

/**
 * Carga el archivo .env desde la raíz del proyecto.
 *
 * Se debe invocar explícitamente (ej. desde main.ts) antes de que cualquier
 * módulo lea process.env. No se auto-ejecuta para evitar side effects
 * al ser importado como módulo de utilidades.
 *
 * Nota: la app es ESM ("type": "module"), por lo que no se puede usar
 * `__dirname`; se deriva la ruta con `import.meta.url`.
 */
export function loadEnv(): void {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const envFilePath = path.resolve(__dirname, '..', '..', '.env');

  if (!fs.existsSync(envFilePath)) {
    console.error(
      `.env no encontrado en ${envFilePath}. Copia .env.example a .env y completa los valores.`,
    );
    process.exit(1);
  }

  config({ path: envFilePath, quiet: true });

  // Validación de secretos en producción: no permitir placeholders.
  if (process.env.NODE_ENV === 'production') {
    const placeholders = ['cambiar_en_produccion', ''];
    for (const key of ['JWT_SECRET', 'JWT_REFRESH_SECRET']) {
      const value = process.env[key] ?? '';
      if (placeholders.includes(value) || value.length < 32) {
        console.error(`Variable ${key} inválida o placeholder en producción.`);
        process.exit(1);
      }
    }
  }
}