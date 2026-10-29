import 'reflect-metadata'; // Obligatorio antes de cualquier import de Nest (inyección de dependencias).

import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import { loadEnv } from './config/load-env.js';
import { Config, ConfigService } from './config/config.service.js';
import { createCorsMiddleware } from './config/cors.js';
import { createAuthLimiter, createGlobalLimiter } from './config/rate-limit.js';
import { swaggerConfiguration } from './config/swagger.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { AppModule } from './app.module.js';

// Carga (y exige) .env antes de que cualquier módulo lea process.env.
loadEnv();

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Logger explícito: solo error, warn y log (no debug).
    logger: ['error', 'warn', 'log'],
  });

  // Instancia única de ConfigService provista por el contenedor de DI.
  const configService = app.get(ConfigService);

  // Headers de seguridad por defecto (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.).
  app.use(helmet());

  // Parse del header Cookie -> req.cookies (necesario para la cookie de sessión).
  app.use(cookieParser());

  // CORS: orígenes permitidos desde CORS_ORIGIN + credenciales habilitadas.
  // Se usa createCorsMiddleware para devolver 403 (no 500) cuando el origen no está autorizado.
  // Se aplica ANTES del rate limiting para que las solicitudes rechazadas no cuenten.
  app.use(createCorsMiddleware(configService));

  // Rate limiting global (safety net): evita que una IP abogue la app entera.
  app.use(createGlobalLimiter(configService));

  // Rate limiting estricto para endpoints sensibles (login, registro, reset, captcha).
  // Se aplica solo al prefijo /auth; cuando existan esas rutas, se activará solo allí.
  app.use('/auth', createAuthLimiter(configService));

  // Validación global de DTOs: descarta propiedades no declaradas y transforma tipos.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro global de excepciones: normaliza cualquier error a una respuesta consistente.
  app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
  // Interceptor global de respuesta. Se instancia directamente con el Reflector
  // para evitar dependencias del contenedor de DI que pueden no estar disponibles.
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()));

  // Cierre ordenado (SIGTERM/SIGINT) para contenedores y orquestadores.
  app.enableShutdownHooks();

  // Documentación OpenAPI en /api/docs.
  swaggerConfiguration(app);

  const port = configService.getNumber(Config.APP_PORT) ?? 3000;
  // Escucha en todas las interfaces para compatibilidad con contenedores Docker.
  await app.listen(port, '0.0.0.0');

  logger.log(`Aplicación escuchando en el puerto ${port}`);
}

bootstrap().catch((err) => {
  logger.error('Error al arrancar la aplicación', err as Error);
  process.exit(1);
});