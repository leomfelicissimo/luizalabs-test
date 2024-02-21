import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './auth.module';
import { JwtService } from '@nestjs/jwt';

class JwtServiceMock {
  verifyAsync(token: string, options: any) {
    if (token === 'admintoken123') {
      return {
        clientId: 'admin',
        role: 'ADMIN',
      };
    } else if (token === 'defaulttoken123') {
      return {
        clientId: 'default',
        role: 'DEFAULT',
      };
    } else throw new Error('Invalid!');
  }

  signAsync(payload) {
    return {
      authToken: 'token123'
    };
  }
}

describe('Auth Controller Integration Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
    .overrideProvider(JwtService)
    .useClass(JwtServiceMock)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should return unauthorized when getting wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ clientId: 'a', password: 'b' })
      .expect(401);
  });

  it('should do login sucessfully', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ clientId: 'luizalabs', password: '12345678' })
      .expect(200);
  });

  it('should return error on invalid login payload', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ clientId: 'luizalabs' })
      .expect(400);
  });

  it('should return error non-admin access', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ clientId: 'abc', password: '87654321' })
      .expect(401);
  });

  it('should do register new user when admin', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', 'Bearer admintoken123')
      .send({ clientId: 'newapp', password: 'abc123456', description: 'this is for testing' })
      .expect(201);
  });

  it('should do return error on invalid register payload', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', 'Bearer admintoken123')
      .send({ asdasda: 'newapp', password: 'abc123456' })
      .expect(400);
  });
});
