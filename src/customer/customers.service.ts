import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import DatabaseProvider, { CustomerTable } from 'src/database/database-provider';

export class CustomerAlreadyExists extends Error {
  constructor() {
    super('The customer already exists.');
  }
};

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private readonly database: DatabaseProvider) { }

  create(createCustomerDto: CreateCustomerDto) {
    const current = this.database.selectWhere('customers', { email: createCustomerDto.email });
    this.logger.log(`Creating new customer. Finding current: ${typeof current}`);
    if (current.length > 0) {
      throw new CustomerAlreadyExists();
    } else {
      this.logger.log('Customer does not exists. Lets create it');
      return this.database.insertInto<CustomerTable>('customers', {
        email: createCustomerDto.email,
        name: createCustomerDto.name,
      })
    }
  }

  findAll() {
    return this.database.select('customers');
  }

  findOne(uid: string) {
    return this.database.selectById('customers', uid);
  }

  update(uid: string, updateCustomerDto: UpdateCustomerDto) {
    return this.database.update('customers', uid, updateCustomerDto);
  }

  remove(uid: string) {
    return this.database.deleteFrom('customers', uid);
  }
}
