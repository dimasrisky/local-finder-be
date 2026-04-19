import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Local Finder API')
    .setDescription('Swagger untuk scraping data bisnis via google maps')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  app.setGlobalPrefix('v1')
  
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
