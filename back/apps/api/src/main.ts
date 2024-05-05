import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import fastifyCookie from '@fastify/cookie';
import * as qs from 'qs';
import * as multer from 'fastify-multer';
import { I18nValidationPipe } from 'nestjs-i18n';

import { API_HTTP_PORT } from 'libs/config';
import { AppExceptionFilter } from 'libs/utils/interceptors/AppExceptionFilter';
import { ApiModule } from 'libs/api/src/api.module';
import { jwtConstants } from 'libs/jwt-auth/src/constants';

const fAdapter = new FastifyAdapter({
  logger: false,
  querystringParser: (str) => qs.parse(str),
  pluginTimeout: 62000,
});

fAdapter.register(multer.contentParser);

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ApiModule,
    fAdapter,
  );

  await app.register(fastifyCookie, {
    secret: jwtConstants.cookies,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,

      // skipUndefinedProperties: true,
    }),
  );

  app.useGlobalFilters(new AppExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Shared API')
    .setDescription('Shared API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const docs = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('/swagger', app, docs);
  app.enableCors({
    origin: '*',
  });

  await app.listen(API_HTTP_PORT, '0.0.0.0');
}
bootstrap();
