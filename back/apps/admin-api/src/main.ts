import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as qs from 'qs';
import * as multer from 'fastify-multer';

import { AdminApiModule } from './admin-api.module';
import { ADMIN_API_HTTP_PORT } from 'libs/config';
import { AppExceptionFilter } from 'libs/utils/interceptors/AppExceptionFilter';

const fAdapter = new FastifyAdapter({
  logger: false,
  querystringParser: (str) => qs.parse(str),
  pluginTimeout: 62000,
  bodyLimit: 1048576 * 5,
});

fAdapter.register(multer.contentParser);

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AdminApiModule,
    fAdapter,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,

      // skipUndefinedProperties: true,
    }),
  );

  app.useGlobalFilters(new AppExceptionFilter());
  app.setGlobalPrefix('admin');
  const config = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('The Admin API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const docs = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('/admin/swagger', app, docs);

  app.enableCors({
    origin: '*',
  });

  await app.listen(ADMIN_API_HTTP_PORT, '0.0.0.0');
}
bootstrap();
