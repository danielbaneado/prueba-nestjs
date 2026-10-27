import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

const logger = new Logger('Swagger');

// Cómo autenticarse en /api/docs. La app usa la sesión de BetterAuth en una
// cookie (no un token Bearer): el navegador la guarda al iniciar sesión y la
// envía sola en cada "Try it out", porque Swagger está en el mismo origen.
const descripcion = `
API REST para gestionar el mantenimiento de la flota de vehículos de FleetCore.
`;

export const swaggerConfiguration = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('FleetCore Maintenance API')
    .setDescription(descripcion)
    .setVersion('1.0.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'api-key')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-seed-api-key' }, 'seed-api-key')
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // persistAuthorization: no perder la sesión al recargar la documentación.
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  logger.log(`Documentación disponible en http://localhost:${5003}/api/docs`);
};