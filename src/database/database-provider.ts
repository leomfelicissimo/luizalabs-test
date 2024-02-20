import { Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";

export type CustomerTable = {
  id?: string;
  name: string;
  email: string;
}

export type WishListTable = {
  id?: string;
  customerId: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  productBrand: string;
  productImage: string;
}

export type ProductTable = {
  id?: string;
  externalId: string;
  price: number;
  title: string;
  brand: string;
  image: string;
}

type DatabaseDefinition = {
  customers: Map<string, CustomerTable>,
  wishlists: Map<string, WishListTable>,
  products: Map<string, ProductTable>,
};

@Injectable()
export default class DatabaseProvider {
  private readonly logger = new Logger(DatabaseProvider.name);

  private readonly database: DatabaseDefinition = {
    customers: new Map(),
    wishlists: new Map(),
    products: new Map(),
  };

  insertInto<T>(tableName: string, values: T): T {
    this.logger.log(`Inserting into ${tableName} values: ${values}`);
    const table: Map<string, T> = this.database[tableName];
    const id = randomUUID();
    table.set(id, values);

    this.logger.log(`Imserted new line. Table rows: ${table.size}.`);
    return Object.assign(values, { id })
  }

  deleteFrom<T>(tableName: string, key) {
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

  select<T>(tableName: string): T[] {
    const table: Map<string, T> = this.database[tableName];
    const result: T[] = [];
    table.forEach(item => result.push(item));

    return result;
  }

  private filterBy(tableData: any[], field: string, value: string) {
    return tableData.filter(item => item[field] === value);
  }

  selectById<T>(tableName: string, id: string): T {
    const table: Map<string, T> = this.database[tableName];
    return table.get(id);
  }

  selectWhere<T>(tableName: string, filter: any): T[] {
    const table: Map<string, T> = this.database[tableName];
    let filtered = Array.from(table.values());
    this.logger.log(filtered);
    Object.keys(filter).forEach(key => {
      filtered = this.filterBy(filtered, key, filter[key])
    });

    this.logger.log(`Filtered items: ${filtered}`);

    return filtered;
  }
}