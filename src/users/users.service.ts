import { Injectable, Logger } from '@nestjs/common';
import RepositoryProvider from 'src/repository/repository.provider';
import { UsersSchema } from 'src/repository/repository.types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly repository: RepositoryProvider) {}

  // The right approach here is to use a bcrypt or similar to hash the password
  // and match the hash.
  findByEmailAndPassword(email: string, password: string) {
    this.logger.log(`Finding a username with ${email}`);
    return this.repository.findOne<UsersSchema>('users', {
      email,
      password
    });
  }
}
