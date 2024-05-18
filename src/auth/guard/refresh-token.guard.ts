import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtRefresh } from '../strategy/refresh-token.strategy';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(jwtRefresh) {} // jwt-refresh matches the name of the strategy
