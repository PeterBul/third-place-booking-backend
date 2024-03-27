import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, SignInDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { e_Roles } from './enum/role.enum';
import { JwtPayload } from './strategy';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: AuthDto) {
    // generate the hash
    const hash = await this.hashData(dto.password);
    // save the user in the database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          phone: dto.phone,
          isMemberBloom: dto.isMemberBloom,
          isMemberThirdPlace: dto.isMemberThirdPlace,
          firstName: dto.firstName,
          lastName: dto.lastName,
          roles: {
            connect: {
              id: e_Roles.User,
            },
          },
        },
        include: {
          roles: true,
        },
      });

      return this.signTokens(user.id, user.email, user.roles);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signIn(dto: SignInDto) {
    // find the user in the database
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      include: {
        roles: true,
      },
    });
    // if the user is not found throw an error
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // compare the password with the hash
    const isPasswordValid = await argon.verify(user.hash, dto.password);
    // if the password is wrong throw an error
    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong password');
    }

    return this.signTokens(user.id, user.email, user.roles);
  }

  async logout(userId: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });

    delete user.hash;
    delete user.refreshToken;

    return user;
  }

  private hashData(data: string) {
    return argon.hash(data);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async signTokens(
    userId: number,
    email: string,
    roles: {
      id: number;
    }[],
  ): Promise<{ accessToken: string; refreshToken: string; roles: number[] }> {
    const rolesArray = roles.map((role) => role.id);
    const payload: JwtPayload = {
      UserInfo: {
        sub: userId,
        email,
        roles: rolesArray,
      },
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '1h',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    await this.updateRefreshToken(userId, refreshToken);

    return {
      accessToken,
      refreshToken,
      roles: rolesArray,
    };
  }

  async refreshTokens(userId: number, request: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
      },
    });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshToken = request.cookies.refresh_token;

    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    return await this.signTokens(user.id, user.email, user.roles);
  }

  storeTokenInCookie(
    res: Response,
    authToken: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('access_token', authToken.accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
    });
    res.cookie('refresh_token', authToken.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  }
}
