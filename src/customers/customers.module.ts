import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { ProductModule } from 'src/product/product.module';
import { RepositoryModule } from '../repository/repository.module';
import { WishListModule } from 'src/wish-list/wish-list.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

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
