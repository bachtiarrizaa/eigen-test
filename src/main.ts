import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Gloval interceptor
  app.useGlobalInterceptors(new TransformInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('Backend test — Book borrowing system')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
  console.log('Swagger docs at http://localhost:3000/api-docs');
}
void bootstrap();
