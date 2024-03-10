import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from './access-token.strategy';

export const jwtRefresh = 'jwt-refresh';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  jwtRefresh,
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get('JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // TODO: Make this express agnostic
    const user = await this.prisma.user.findUnique({
      where: { id: payload.UserInfo.sub },
    });
    delete user.hash;
    return user;
  }

  private static extractJWT(req: any): string | null {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return req.cookies.refresh_token;
    }
    return null;
  }
}
