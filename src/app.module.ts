import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customer/customers.module';
import { WishListModule } from './wish-list/wish-list.module';
import { ConfigModule } from '@nestjs/config';
import DatabaseProvider from './database/database-provider';

@Module({
  imports: [ConfigModule.forRoot(), CustomersModule, WishListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
