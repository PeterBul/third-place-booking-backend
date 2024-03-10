import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { e_Roles } from '../enum/role.enum';
import { ROLES_KEY } from '../decorator';
import { RequestUser } from '../strategy/access-token.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<e_Roles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<{ user: RequestUser }>();
    return requiredRoles.some((role) =>
      user.roles.some((userRole) => userRole.id === role),
    );
  }
}
