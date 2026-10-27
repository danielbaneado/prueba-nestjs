import { Injectable } from '@nestjs/common';
import { runSeed } from '../../database/seeds/seed.js';

@Injectable()
export class SeedService {
  async run() {
    await runSeed();
    return { success: true, message: 'Seed executed' };
  }
}
