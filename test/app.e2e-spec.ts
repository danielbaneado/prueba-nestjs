import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('/health (GET)', async () => {
    const { body } = await request(app.getHttpServer()).get('/health').expect(200);
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
    expect(typeof body.timestamp).toBe('string');
  });

  it('/captcha (GET) returns a token and a question', async () => {
    const { body } = await request(app.getHttpServer()).get('/captcha').expect(200);
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
    expect(typeof body.question).toBe('string');
    expect(body.question).toContain('?');
  });

  it('/captcha/verify (GET) returns ok false for an unknown token', async () => {
    const { body } = await request(app.getHttpServer())
      .get('/captcha/verify')
      .query({ token: 'unknown', answer: '0' })
      .expect(200);
    expect(body.ok).toBe(false);
  });

  afterEach(async () => {
    await app.close();
  });
});