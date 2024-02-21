import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleLogger, INestApplication, ValidationPipe } from '@nestjs/common';
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
    })
    .overrideProvider(JwtService)
    .useClass(JwtServiceMock)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    //app.useLogger(new ConsoleLogger());
  });

  it('should create a new customer', () => {
    return request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test1', email: 'test1@test1.com' })
      .expect(201);
  });

  it('should not allow duplicated emails', async () => {
    await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test', email: 'test@test.com' });
    
    const response = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test', email: 'test@test.com' });
    
    expect(response.status).toEqual(400);
  });

  it('should return all customers', async () => {
    await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test', email: 'test@test.com' });

    await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test2', email: 'test2@test.com' });
    
    const response = await request(app.getHttpServer())
      .get('/customers')
      .set('Authorization', 'Bearer defaulttoken123');

    expect(response.body).toHaveLength(2);
  });

  it('should add product to customer\'s wishlist', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test', email: 'test@test.com' });

    await request(app.getHttpServer())
      .put(`/customers/${response.body.id}/wishlists`)
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ productId: '1bf0f365-fbdd-4e21-9786-da459d78dd1f' });

    const wishlistResponse = await request(app.getHttpServer())
      .get(`/customers/${response.body.id}/wishlists`)
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test2', email: 'test2@test.com' });

    expect(wishlistResponse.body.products).toHaveLength(1);
    expect(wishlistResponse.body.products.at(0).id).toEqual('1bf0f365-fbdd-4e21-9786-da459d78dd1f');
  });

  it('should not add a duplicated product in wishlist', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ name: 'test', email: 'test@test.com' });

    await request(app.getHttpServer())
      .put(`/customers/${response.body.id}/wishlists`)
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ productId: '1bf0f365-fbdd-4e21-9786-da459d78dd1f' });

    return request(app.getHttpServer())
      .put(`/customers/${response.body.id}/wishlists`)
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ productId: '1bf0f365-fbdd-4e21-9786-da459d78dd1f' })
      .expect(400);
  });

  it('should return a error if customer does not exist', async () => {
    return request(app.getHttpServer())
      .put(`/customers/123/wishlists`)
      .set('Authorization', 'Bearer defaulttoken123')
      .send({ productId: '1bf0f365-fbdd-4e21-9786-da459d78dd1f' })
      .expect(400);
  });
});
