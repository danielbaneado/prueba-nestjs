import { Controller, Post, UseGuards } from '@nestjs/common';
import { SeedApiKeyGuard } from '../../common/guards/seed-api-key.guard.js';

@Controller()
export class SeedController {
  @Post('seed')
  @UseGuards(SeedApiKeyGuard)
  runSeed() {
    return { success: true, message: 'Seed endpoint invoked' };
  }
}
