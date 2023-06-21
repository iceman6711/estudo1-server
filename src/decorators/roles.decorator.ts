
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: (string[] | string)[]) => SetMetadata(ROLES_KEY, (roles[0] instanceof Array) ? roles[0] : roles);
