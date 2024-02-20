import { Module } from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { ProductModule } from 'src/product/product.module';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [RepositoryModule, ProductModule],
  providers: [WishListService],
  exports: [WishListService]
})
export class WishListModule { }
