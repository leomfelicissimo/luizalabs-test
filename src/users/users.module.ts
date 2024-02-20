import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
