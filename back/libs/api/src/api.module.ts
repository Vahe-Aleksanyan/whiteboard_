import { Module } from '@nestjs/common';
import { DatabaseModule } from 'libs/database/src';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtAuthModule } from 'libs/jwt-auth/src';
import { MSSendersModule } from 'libs/micoservices-clients/senders/ms-senders.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    // MSSendersModule,
    JwtAuthModule,
    AuthModule,
  ],
})
export class ApiModule {}
