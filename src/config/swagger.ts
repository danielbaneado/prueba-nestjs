import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';
import { Config, ConfigService } from './config.service.js';

const logger = new Logger('Swagger');

// Cómo autenticarse en /api/docs. La app usa la sesión de BetterAuth en una
// cookie (no un token Bearer): el navegador la guarda al iniciar sessión y la
// envía sola en cada "Try it out", porque Swagger está en el mismo origen.
const descripcion = `
API REST para gestionar el mantenimiento de la flota de vehículos de FleetCore.
`;

export const swaggerConfiguration = (app: INestApplication): void => {
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('SapmiFleetCore Maintenance API')
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

  const port = configService.getNumber(Config.APP_PORT) ?? 3000;
  logger.log(`Documentación disponible en http://localhost:${port}/api/docs`);
};