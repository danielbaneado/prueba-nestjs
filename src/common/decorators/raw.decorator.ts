import { SetMetadata } from '@nestjs/common';

export const RAW_KEY = 'raw';
/**
 * Desactiva el ResponseInterceptor global para un endpoint específico.
 * Los datos se devuelven tal cual (sin envoltura `{ success, data, timestamp }`).
 *
 * Uso: `@Raw()`
 */
export const Raw = () => SetMetadata(RAW_KEY, true);