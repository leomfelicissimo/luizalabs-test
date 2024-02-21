import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CustomersSchema, ProductsSchema, RepositoryDefinition, RepositorySchemaName, UserRole, UsersSchema, WishListsSchema } from "./repository.types";

@Injectable()
export default class RepositoryProvider {
  private readonly logger = new Logger(RepositoryProvider.name);

  private readonly database: RepositoryDefinition = {
    customers: new Map(),
    wishlists: new Map(),
    products: new Map(),
    users: new Map(),
  };

  constructor() {
    this.initializeRepository();
  }

  private getSchema(schema: RepositorySchemaName) {
    return this.database[schema.toString()];
  }

  create<T>(schema: RepositorySchemaName, value: T, mustGenerateId = true): T {
    this.logger.log(`Inserting into ${schema}`);
    this.logger.debug(value);
    const table: Map<string, T> = this.getSchema(schema);
    const id = mustGenerateId ? randomUUID() : value['id'];
    table.set(id, value);

    this.logger.log(`Inserted new line. Table rows: ${table.size}.`);
    return Object.assign(value, { id })
  }

  delete<T>(schema: RepositorySchemaName, key) {
    this.getSchema(schema).delete(key);
  }

  update<T extends object>(schema: RepositorySchemaName, id: string, values: T): T {
    const table: Map<string, T> = this.getSchema(schema);
    const item = table.get(id);
    const updated = Object.assign(item, values);
    table.set(id, updated);

    return updated;
  }

  exists<T>(schema: RepositorySchemaName, id: string) {
    const table: Map<string, T> = this.getSchema(schema);
    return table.has(id);
  }

  findAll<T>(schema: RepositorySchemaName): T[] {
    const table: Map<string, T> = this.getSchema(schema);
    const result: T[] = [];
    table.forEach(item => result.push(item));

    return result;
  }

  private filterBy(tableData: any[], field: string, value: string) {
    return tableData.filter(item => item[field] === value);
  }

  findById<T>(schema: RepositorySchemaName, id: string): T {
    const table: Map<string, T> = this.getSchema(schema);
    return table.get(id);
  }

  findOne<T>(schema: RepositorySchemaName, filter: any): T {
    const result = this.findMany<T>(schema, filter);
    return result.at(0);
  }

  findMany<T>(schema: RepositorySchemaName, filter: any): T[] {
    const table: Map<string, T> = this.getSchema(schema);
    let filtered = Array.from(table.values());
    Object.keys(filter).forEach(key => {
      filtered = this.filterBy(filtered, key, filter[key])
    });

    return filtered;
  }

  private initializeRepository() {
    this.create<UsersSchema>('users', {
      clientId: 'luizalabs',
      password: '12345678',
      role: UserRole.ADMIN,
      description: 'Admin client id',
    });
  }
}