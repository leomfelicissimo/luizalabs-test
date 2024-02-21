import { Module } from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { RepositoryModule } from '../repository/repository.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [RepositoryModule, ProductModule],
  providers: [WishListService],
  exports: [WishListService]
})
export class WishListModule { }
