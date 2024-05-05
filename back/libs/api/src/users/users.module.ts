import { Module } from '@nestjs/common';
import { MSSendersModule } from 'libs/micoservices-clients/senders/ms-senders.module';
import { UsersProvider } from '@lib/database/schemas/user/users.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ItemProvider } from '@lib/database/schemas/item/item.provider';

@Module({
  controllers: [UsersController],
  imports: [MSSendersModule],
  providers: [UsersService, UsersProvider, ItemProvider],
  exports: [UsersService, UsersProvider, ItemProvider],
})
export class UsersModule {}
