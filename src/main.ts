import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  })

  const configSwagger = new DocumentBuilder()
    .setDescription('API lista de Usuários')
    .setTitle('Lista de Usuários')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, configSwagger)
  SwaggerModule.setup('docs', app, documentFactory)

  app.useGlobalPipes(new ValidationPipe(
    {whitelist: true, } // remove todos valores que passados a mais
  ))

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();