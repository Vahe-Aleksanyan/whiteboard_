import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { TokensDto } from './dto/tokens.dto';
import { Lean } from 'libs/utils/decorator/lean.decorator';
import { Public } from 'libs/jwt-auth/src/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Lean(TokensDto)
  @Public()
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('refresh')
  @Public()
  @Lean(TokensDto)
  refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refresh_token);
  }
}
