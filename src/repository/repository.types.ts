export type CustomersSchema = {
  id?: string;
  name: string;
  email: string;
}

export type WishListsSchema = {
  id?: string;
  customerId: string;
  products: ProductsSchema[];
}

export type ProductsSchema = {
  id?: string;
  price: number;
  title: string;
  brand: string;
  image: string;
  reviewScore: number;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  DEFAULT = 'DEFAULT',
}

export type UsersSchema = {
  id?: string;
  clientId: string;
  description: string;
  password: string;
  role: UserRole;
}

export type RepositorySchemaName = 'customers' | 'wishlists' | 'products' | 'users';

export type RepositoryDefinition = {
  customers: Map<RepositorySchemaName, CustomersSchema>,
  wishlists: Map<RepositorySchemaName, WishListsSchema>,
  products: Map<RepositorySchemaName, ProductsSchema>,
  users: Map<RepositorySchemaName, UsersSchema>,
};
