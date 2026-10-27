import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '../../config/config.service.js';
import { Config } from '../../config/config.keys.js';

@Injectable()
export class SeedApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-seed-api-key'] ?? request.headers['x-api-key'];
    const expected = this.configService.get(Config.SEED_API_KEY);
    if (!apiKey || !expected || apiKey !== expected) {
      throw new UnauthorizedException('Invalid seed API key');
    }
    return true;
  }
}
