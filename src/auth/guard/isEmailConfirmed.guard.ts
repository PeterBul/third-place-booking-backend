import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../strategy/access-token.strategy';

@Injectable()
export class IsEmailConfirmedGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<{ user: RequestUser }>();
    return user.confirmed;
  }
}
