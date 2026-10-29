import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Raw } from './common/decorators/raw.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Raw()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @Raw()
  health(): { status: 'ok'; uptime: number; timestamp: string } {
    return { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() };
  }
}
