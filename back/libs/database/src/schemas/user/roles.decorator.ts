import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'libs/guards/roles.guard';

import { UserRoleEnum } from './users.roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoleEnum[]) =>
  applyDecorators(UseGuards(RolesGuard), SetMetadata(ROLES_KEY, roles));
