import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customer.controller';
import DatabaseProvider from 'src/database/database-provider';
import { DatabaseModule } from 'src/database/database.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [DatabaseModule, ProductModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule { }
