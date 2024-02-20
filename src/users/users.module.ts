import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
