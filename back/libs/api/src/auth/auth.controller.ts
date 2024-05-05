import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { GoogleTokenDto, RegisterDto } from './dto/register.dto';
import { TokensDto } from './dto/tokens.dto';
import { Lean } from 'libs/utils/decorator/lean.decorator';
import { Public } from 'libs/jwt-auth/src/jwt-auth.guard';
import { CheckTokenExpiryGuard } from 'libs/api/src/auth/checkTokenExpiry.guard';
import { SendEmailDto } from './dto/send-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setTokenCookie(
    response: FastifyReply,
    access_token: string,
    refresh_token: string,
  ) {
    response.setCookie('token', access_token, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 5, //5 days
      httpOnly: true,
    });
    response.setCookie('refresh_token', refresh_token, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30, //30 days
      httpOnly: true,
    });
  }

  @Post('login')
  @Lean(TokensDto)
  @Public()
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const tokens = await this.authService.login(body);
    this.setTokenCookie(response, tokens.access_token, tokens.refresh_token);
    return tokens;
  }

  @Post('register')
  @Public()
  async register(@Body() body: RegisterDto) {
    return await this.authService.register(body);
  }

  @Post('refresh')
  @Public()
  @Lean(TokensDto)
  async refresh(
    @Body() body: RefreshDto,
    @Res({ passthrough: true }) response: FastifyReply,
    @Req() req: FastifyRequest,
  ) {
    const refresh_token = req.cookies?.refresh_token ?? body.refresh_token;

    const tokens = await this.authService.refresh(refresh_token);
    this.setTokenCookie(response, tokens.access_token, tokens.refresh_token);

    return tokens;
  }

  @Post('google/callback')
  // @UseGuards(AuthGuard('google'))
  async googleLoginCallback(
    @Res({ passthrough: true }) response: FastifyReply,
    @Request() req,
    @Body() body: GoogleTokenDto,
  ) {
    // const googleToken = req.user.accessToken;
    // const googleRefreshToken = req.user.refreshToken;

    const { googleToken } = body;

    const userProfile = await this.authService.getProfile(googleToken);

    const tokens = await this.authService.googleAuth(userProfile.data);

    // this.setTokenCookie(response, tokens.access_token, tokens.refresh_token);
    // response.setCookie('access_google_token', googleToken, { httpOnly: true });
    // response.setCookie('refresh_google_token', googleRefreshToken, {
    //   httpOnly: true,
    // });

    // response.redirect('http://localhost:3000/auth/profile');
    return tokens;
  }

  @Post('email/forgot-password')
  @Public()
  async sendEmailForgotPassword(@Body() body: SendEmailDto) {
    try {
      const isEmailSent = await this.authService.sendEmailForgotPassword(
        body.email,
      );
      if (isEmailSent) {
        return { message: 'LOGIN. EMAIL RESENT' };
      }
    } catch (error) {
      throw new Error('LOGIN.ERROR.SEND EMAIL');
    }
  }

  @Post('email/reset-password')
  @Public()
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.authService.resetPassword(body);
  }

  // @UseGuards(CheckTokenExpiryGuard)
  // @Get('profile')
  // async getProfile(@Req() req: FastifyRequest) {
  //   const accessToken = req.cookies['access_google_token'];
  //   if (accessToken)
  //     return (await this.authService.getProfile(accessToken)).data;
  //   throw new UnauthorizedException('No access token');
  // }

  // @Get('google/logout')
  // logoutGoogle(
  //   @Req() req: FastifyRequest,
  //   @Res({ passthrough: true }) response: FastifyReply,
  // ) {
  //   const refreshToken = req.cookies['refresh_google_token'];
  //   response.clearCookie('access_google_token');
  //   response.clearCookie('refresh_google_token');
  //   this.authService.revokeGoogleToken(refreshToken);
  //   response.redirect('http://localhost:3000/');
  // }

  @Get('logout')
  @Public()
  logout(@Res({ passthrough: true }) response: FastifyReply) {
    response.clearCookie('token');
    response.clearCookie('refresh_token');
    return response.code(200).send();
  }
}
