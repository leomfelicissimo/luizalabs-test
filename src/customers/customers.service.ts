import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import RepositoryProvider from 'src/repository/repository.provider';
import { CustomersSchema, WishListsSchema } from 'src/repository/repository.types';

export class CustomerAlreadyExists extends Error {
  constructor() {
    super('The customer already exists.');
  }
};

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private readonly repository: RepositoryProvider) { }

  create(createCustomerDto: CreateCustomerDto) {
    this.logger.log('Creating new customer');
    this.logger.debug(createCustomerDto);

    const current = this.repository.findMany('customers', { email: createCustomerDto.email });

    if (current.length > 0) {
      this.logger.error('The customer already exists!');
      throw new CustomerAlreadyExists();
    } else {
      this.logger.log('Customer does not exists. Lets create it');
      const created = this.repository.create<CustomersSchema>('customers', {
        email: createCustomerDto.email,
        name: createCustomerDto.name,
      });

      // Lets create a wishlist for the customer since the begining
      this.repository.create<WishListsSchema>('wishlists', {
        customerId: created.id!,
        products: [],
      });

      return created;
    }
  }

  findAll() {
    return this.repository.findAll('customers');
  }

  findOne(uid: string) {
    return this.repository.findById('customers', uid);
  }

  update(uid: string, updateCustomerDto: UpdateCustomerDto) {
    return this.repository.update('customers', uid, updateCustomerDto);
  }

  remove(uid: string) {
    return this.repository.delete('customers', uid);
  }
}
