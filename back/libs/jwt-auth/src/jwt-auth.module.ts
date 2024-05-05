import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersProvider } from '@lib/database/schemas/user/users.provider';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
// import { AuthService } from 'libs/api/src/auth/auth.service';

const UserAuthJwtServiceProvider = {
  provide: 'UserAuthJwtService',
  useExisting: JwtService,
};

@Module({
  providers: [UsersProvider, JwtStrategy, UserAuthJwtServiceProvider],
  exports: [UserAuthJwtServiceProvider],
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30 days' },
    }),
    PassportModule,
  ],
})
export class JwtAuthModule {}
