import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import type { LoginDto, RefreshDto } from './dto/auth.dto.js';
import { JwtGuard } from '../../common/guards/jwt.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRoles, type User, type UserResponse } from '../users/user.entity.js';

export interface LoginResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponse> {
    const result = await this.authService.login(
      dto.email,
      dto.password,
      dto.captchaToken,
      dto.captchaAnswer,
    );

    res.cookie(
      'session_token',
      result.tokens.accessToken,
      this.authService.getCookieOptions(),
    );

    return {
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    };
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto): Promise<{ accessToken: string }> {
    const tokens = await this.authService.refresh(dto.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): { ok: boolean } {
    res.clearCookie('session_token');
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtGuard)
  me(@CurrentUser() user: User): { id: string; email: string; roles: UserRoles[] } {
    return { id: user.id, email: user.email, roles: user.roles };
  }

  @Get('admin')
  @UseGuards(JwtGuard)
  @Roles(UserRoles.ADMIN)
  admin(@CurrentUser() user: User): { message: string; user: string } {
    return { message: 'Acceso de administrador', user: user.email };
  }
}
