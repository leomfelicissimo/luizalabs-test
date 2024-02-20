import { Module } from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { WishListController } from './wish-list.controller';
import DatabaseProvider from 'src/database/database-provider';
import { HttpService } from '@nestjs/axios';
import ProductClient from '../product/clients/product.client';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from 'src/product/product.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [WishListController],
  providers: [WishListService],
})
export class WishListModule { }
