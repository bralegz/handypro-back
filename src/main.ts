import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = new DocumentBuilder()
    .setTitle('Proyecto Final para ver si nos graduamos')
    .setDescription('HandyPro API description and documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

    app.enableCors({
        origin: '*',
    });

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
}
bootstrap();
