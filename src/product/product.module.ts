import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ProductClient from './clients/product.client';
import ProductService from './product.service';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule, DatabaseModule],
  providers: [ProductClient, ProductService],
  exports: [ProductService]
})
export class ProductModule { }
