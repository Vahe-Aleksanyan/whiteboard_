import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'isPublic';
export const WITH_USER_KEY = 'allowAny';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const AuthRequired = () => SetMetadata(IS_PUBLIC_KEY, false);
export const WithUser = () => SetMetadata(WITH_USER_KEY, true);

@Injectable()
export class UserJwtAuthGuard extends AuthGuard('user-jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  handleRequest(err, user, info, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return user || undefined;
    }

    if (err || !user || user.isDeleted) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
