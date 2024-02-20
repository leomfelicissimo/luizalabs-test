import { Injectable, Logger } from '@nestjs/common';
import RepositoryProvider from '../repository/repository.provider';
import { UsersSchema } from '../repository/repository.types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly repository: RepositoryProvider) {}

  // The right approach here is to use a bcrypt or similar to hash the password
  // and match the hash.
  findByClientIdAndPassword(clientId: string, password: string) {
    this.logger.log(`Finding a user with ${clientId}`);
    return this.repository.findOne<UsersSchema>('users', {
      clientId,
      password
    });
  }

  create(user: UsersSchema) {
    return this.repository.create<UsersSchema>('users', user);
  }
}
