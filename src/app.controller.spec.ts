import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Captcha, CaptchaChallenge } from './common/utils/captcha.js';

class FakeCaptcha {
  generateCaptcha(): CaptchaChallenge {
    return { token: 'fake-token', question: '¿Cuánto es 1 + 1?' };
  }
  verifyCaptcha(_token: string, _answer: number): boolean {
    return true;
  }
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, { provide: Captcha, useClass: FakeCaptcha }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('should return status ok', () => {
      const result = appController.health();
      expect(result.status).toBe('ok');
      expect(typeof result.uptime).toBe('number');
      expect(typeof result.timestamp).toBe('string');
    });
  });

  describe('captcha', () => {
    it('should return a challenge with token and question', () => {
      const result = appController.getCaptcha();
      expect(result.token).toBe('fake-token');
      expect(result.question).toContain('?');
    });
  });

  describe('captcha/verify', () => {
    it('should return ok true for a valid answer', () => {
      expect(appController.verifyCaptcha('fake-token', '2')).toEqual({ ok: true });
    });
  });
});