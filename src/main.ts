import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {rawBody: true});
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true
    }));

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Proyecto Final para ver si nos graduamos')
        .setDescription('HandyPro API description and documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:5174'],    
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe());
    const port = process.env.PORT || 3000;
    await app.listen(port);
    
}
bootstrap();
