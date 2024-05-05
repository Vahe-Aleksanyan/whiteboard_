import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MSSendersModule } from 'libs/micoservices-clients/senders/ms-senders.module';
import { UtilsModule } from 'libs/utils/utils.module';
import { UsersModule } from '../users/users.module';
import { JwtAuthModule } from 'libs/jwt-auth/src/jwt-auth.module';
import { GoogleStrategy } from './google.startegy';
import { EmailTokenProvider } from '@lib/database/schemas/email-token/email-token.provider';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    MSSendersModule,
    UtilsModule,
    UsersModule,
    JwtAuthModule,
    PassportModule,
  ],

  providers: [AuthService, UsersService, GoogleStrategy, EmailTokenProvider],
})
export class AuthModule {}
