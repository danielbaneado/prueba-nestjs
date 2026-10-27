import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { SeedApiKeyGuard } from '../../common/guards/seed-api-key.guard.js';

@Controller()
@ApiSecurity('seed-api-key')
export class SeedController {
  @Post('seed')
  @UseGuards(SeedApiKeyGuard)
  runSeed() {
    return { success: true, message: 'Seed endpoint invoked' };
  }
}
