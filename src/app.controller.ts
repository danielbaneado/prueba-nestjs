import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Captcha } from './common/utils/captcha.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly captcha: Captcha,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Healthcheck. El rate limiter global lo salta. */
  @Get('health')
  health(): { status: 'ok'; uptime: number; timestamp: string } {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  /** Genera un captcha (demo de `Captcha`). Solo el token y la pregunta viajan al cliente. */
  @Get('captcha')
  getCaptcha() {
    return this.captcha.generateCaptcha();
  }

  /** Valida un captcha (demo de `verifyCaptcha`). Uso único. */
  @Get('captcha/verify')
  verifyCaptcha(
    @Query('token') token: string,
    @Query('answer') answer: string,
  ): { ok: boolean } {
    if (!token || answer === undefined || answer === '') {
      throw new HttpException('Se requieren token y answer', HttpStatus.BAD_REQUEST);
    }
    const numericAnswer = Number(answer);
    if (Number.isNaN(numericAnswer)) {
      throw new HttpException('answer debe ser un número', HttpStatus.BAD_REQUEST);
    }
    const ok = this.captcha.verifyCaptcha(token, numericAnswer);
    return { ok };
  }
}