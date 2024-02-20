import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { ProductModule } from 'src/product/product.module';
import { RepositoryModule } from 'src/repository/repository.module';
import { WishListModule } from 'src/wish-list/wish-list.module';

@Module({
  imports: [RepositoryModule, ProductModule, WishListModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule { }
