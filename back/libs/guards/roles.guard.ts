import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
  AuthRequired,
  IS_PUBLIC_KEY,
  UserJwtAuthGuard,
} from 'libs/jwt-auth/src/jwt-auth.guard';

import { UserDocument } from '@lib/database/schemas/user/user.schema';

import {
  Roles,
  ROLES_KEY,
} from 'libs/database/src/schemas/user/roles.decorator';
import { UserRoleEnum } from 'libs/database/src/schemas/user/users.roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      UserRoleEnum[] | UserRoleEnum
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || isPublic) {
      return true;
    }

    let { user } = context.switchToHttp().getRequest<{ user: UserDocument }>();

    if (context.getType() === 'ws') {
      user = context.switchToWs().getClient().handshake.user;
    }

    if (Array.isArray(requiredRoles)) {
      return requiredRoles.some((role) => user.role === role);
    }
    return requiredRoles === user.role;
  }
}

export const UserGuard = () =>
  applyDecorators(
    ApiBearerAuth(),
    AuthRequired(),
    UseGuards(UserJwtAuthGuard),
    Roles(UserRoleEnum.USER),
  );

export const AdminGuard = () =>
  applyDecorators(
    ApiBearerAuth(),
    AuthRequired(),
    UseGuards(UserJwtAuthGuard),
    Roles(UserRoleEnum.ADMIN),
  );

export const UserAuthGuard = () =>
  applyDecorators(ApiBearerAuth(), AuthRequired(), UseGuards(UserJwtAuthGuard));
