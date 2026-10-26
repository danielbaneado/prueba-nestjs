import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

const logger = new Logger('Swagger');

// Cómo autenticarse en /api/docs. La app usa la sesión de BetterAuth en una
// cookie (no un token Bearer): el navegador la guarda al iniciar sesión y la
// envía sola en cada "Try it out", porque Swagger está en el mismo origen.
const descripcion = `
Sapmi backend parte 2.
`;

export const swaggerConfiguration = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Comercial 360')
    .setDescription(descripcion)
    .setVersion('1.0.0')
    // El scheme name ('session') debe coincidir con el nombre usado en
    // addSecurityRequirements. 'session_token' es el nombre del parámetro cookie.
    .addCookieAuth('session', { type: 'apiKey', in: 'cookie' }, 'session')
    .addSecurityRequirements('session')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // persistAuthorization: no perder la sesión al recargar la documentación.
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = (app.getHttpServer() as any)?.address()?.port ?? '3000';
  logger.log(`Documentación disponible en http://localhost:${port}/api/docs`);
};