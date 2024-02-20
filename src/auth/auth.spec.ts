import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './auth.module';

describe('Auth Controller Integration Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should return unauthorized when getting wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ clientId: 'a', password: 'b' })
      .expect(401);
  });
});
