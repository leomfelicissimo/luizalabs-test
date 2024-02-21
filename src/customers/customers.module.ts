import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { RepositoryModule } from '../repository/repository.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from '../product/product.module';
import { WishListModule } from '../wish-list/wish-list.module';

@Module({
  imports: [
    RepositoryModule,
    ProductModule,
    WishListModule,
    JwtModule,
    ConfigModule.forRoot(),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule { }
