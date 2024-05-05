import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MS_SENDERS_PORT } from 'libs/config';
import { SendersModule } from './senders.module';
import { LocalTimeLogger } from 'libs/utils/logger/locale-time-logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SendersModule,
    {
      transport: Transport.TCP,
      options: { port: MS_SENDERS_PORT },
      logger: new LocalTimeLogger(),
    },
  );
  await app.listen();
}
bootstrap();
