import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { SeedApiKeyGuard } from '../../common/guards/seed-api-key.guard.js';
import { SeedService } from './seed.service.js';

@Controller()
@ApiSecurity('seed-api-key')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('seed')
  @UseGuards(SeedApiKeyGuard)
  async runSeed() {
    return this.seedService.run();
  }
}
