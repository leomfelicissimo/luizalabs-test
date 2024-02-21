import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { CustomersModule } from './customers.module';
import RepositoryProvider from '../repository/repository.provider';
import { CustomersSchema } from '../repository/repository.types';

class JwtServiceMock {
  verifyAsync(token: string, options: any) {
    if (token === 'defaulttoken123') {
      return {
        clientId: 'default',
        role: 'DEFAULT',
      };
    } else throw new Error('Invalid!');
  }
}

describe('Customer Controller Integration Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CustomersModule],
      providers: [{
        provide: 'RepositoryProvider',
        useFactory: () => {
          const repository = new RepositoryProvider();
          repository.create<CustomersSchema>('customers', { name: 'test', email: 'test@test.com'});
          return repository;
        }
      }]
    })
    .overrideProvider(JwtService)
    .useClass(JwtServiceMock)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should create a new customer', () => {
    return request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test1', email: 'test1@test1.com' })
      .expect(201);
  });

  it('should not allow duplicated emails', () => {
    return request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test', email: 'test@test.com' })
      .expect(400);
  });
});
