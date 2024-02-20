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
  externalId: string;
  price: number;
  title: string;
  brand: string;
  image: string;
}

export enum UserRole {
  ADMIN,
  CONSUMER,
}

export type UsersSchema = {
  id?: string;
  email: string;
  password: string;
  role: UserRole;
}

export type RepositoryDefinition = {
  customers: Map<string, CustomersSchema>,
  wishlists: Map<string, WishListsSchema>,
  products: Map<string, ProductsSchema>,
  users: Map<string, UsersSchema>,
};
