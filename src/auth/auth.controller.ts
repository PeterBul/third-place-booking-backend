import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignInDto } from './dto';
import { GetUser } from './decorator';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { Request, Response } from 'express';
import { AccessTokenGuard } from './guard';

// TODO: Send refresh tokens with http only cookies
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authTokens = await this.authService.signUp(dto);
    this.authService.storeTokenInCookie(res, authTokens);
    return authTokens;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authTokens = await this.authService.signIn(dto);
    this.authService.storeTokenInCookie(res, authTokens);
    return authTokens;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(
    @GetUser('id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(
    @GetUser('id') userId: number,
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const authTokens = await this.authService.refreshTokens(userId, request);
    this.authService.storeTokenInCookie(res, authTokens);
    return authTokens;
  }
}
