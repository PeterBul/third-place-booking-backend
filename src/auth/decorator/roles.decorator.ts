import { SetMetadata } from '@nestjs/common';
import { e_Roles } from '../enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: e_Roles[]) => SetMetadata(ROLES_KEY, roles);
