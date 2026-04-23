import * as Sentry from '@sentry/nestjs';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: process.env.DSN_SENTRY,
    sendDefaultPii: true,
    environment: process.env.NODE_ENV || 'development',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('local-finder-be API')
    .setDescription('This is description of the local-finder-be API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const OpenApiSpecification = apiReference({
    title: 'local-finder-be API',
    theme: 'default',
    content: document,
  });

  app.use('/api/docs', OpenApiSpecification);

  await app.listen(process.env.PORT || 3000);
}
void bootstrap();
