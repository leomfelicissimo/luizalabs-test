import { Module } from '@nestjs/common';
import RepositoryProvider from './repository.provider';

@Module({
  providers: [RepositoryProvider],
  exports: [RepositoryProvider],
})
export class RepositoryModule { }
