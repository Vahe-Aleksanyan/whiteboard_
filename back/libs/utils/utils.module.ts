import { UsersProvider } from '@lib/database/schemas/user/users.provider';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// import { MSSendersModule } from 'libs/microservices-clients/senders/ms-senders.module';

import { UtilsService } from './utils.service';

@Global()
@Module({
  providers: [UtilsService, UsersProvider],
  exports: [UtilsService],
  imports: [ConfigModule],
})
export class UtilsModule {}
