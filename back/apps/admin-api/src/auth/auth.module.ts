import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { MSSendersModule } from 'libs/micoservices-clients/senders/ms-senders.module';

import { UtilsModule } from 'libs/utils/utils.module';
// import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from 'libs/jwt-auth/src/jwt-auth.module';
import { UsersProvider } from '@lib/database/schemas/user/users.provider';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    MSSendersModule,
    UtilsModule,
    // UsersModule,
    JwtAuthModule,
  ],
  providers: [AuthService, UsersProvider],
})
export class AuthModule {}
