import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('API for organizing bookings in Third Place')
    .setVersion('1.0')
    .addTag('booking')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip away any properties that don't have any decorators
      transform: true, // Transform the incoming data to match the DTO
    }),
  );
  app.use(cookieParser());
  await app.listen(3334);
}
bootstrap();
