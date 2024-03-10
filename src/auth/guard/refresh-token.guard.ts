import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtRefresh } from '../strategy/refresh-token.strategy';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(jwtRefresh) {} // jwt-refresh matches the name of the strategy
