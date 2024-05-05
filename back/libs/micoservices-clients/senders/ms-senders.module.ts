import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MS_SENDERS, MS_SENDERS_PORT } from 'libs/config';

import { MSSendersService } from './ms-senders.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MS_SENDERS,
        transport: Transport.TCP,
        options: {
          port: MS_SENDERS_PORT,
        },
      },
    ]),
  ],
  providers: [MSSendersService],
  exports: [MSSendersService],
})
export class MSSendersModule {}
