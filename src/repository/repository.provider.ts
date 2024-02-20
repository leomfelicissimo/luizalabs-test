import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import { RepositoryDefinition, UserRole, UsersSchema } from "./repository.types";

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

  create<T>(tableName: string, value: T, mustGenerateId = true): T {
    this.logger.log(`Inserting into ${tableName} values: ${value}`);
    const table: Map<string, T> = this.database[tableName];
    const id = mustGenerateId ? randomUUID() : value['id'];
    table.set(id, value);

    this.logger.log(`Imserted new line. Table rows: ${table.size}.`);
    return Object.assign(value, { id })
  }

  delete<T>(tableName: string, key) {
    this.database[tableName].delete(key);
  }

  update<T extends object>(tableName: string, id: string, values: T): T {
    const table: Map<string, T> = this.database[tableName];
    const item = table.get(id);
    const updated = Object.assign(item, values);
    table.set(id, updated);

    return updated;
  }

  exists<T>(tableName: string, id: string) {
    const table: Map<string, T> = this.database[tableName];
    return table.has(id);
  }

  findAll<T>(tableName: string): T[] {
    const table: Map<string, T> = this.database[tableName];
    const result: T[] = [];
    table.forEach(item => result.push(item));

    return result;
  }

  private filterBy(tableData: any[], field: string, value: string) {
    return tableData.filter(item => item[field] === value);
  }

  findById<T>(tableName: string, id: string): T {
    const table: Map<string, T> = this.database[tableName];
    return table.get(id);
  }

  findOne<T>(tableName: string, filter: any): T {
    const result = this.findMany<T>(tableName, filter);
    return result.at(0);
  }

  findMany<T>(tableName: string, filter: any): T[] {
    const table: Map<string, T> = this.database[tableName];
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