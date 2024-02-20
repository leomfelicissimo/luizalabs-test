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

export type RepositoryDefinition = {
  customers: Map<string, CustomersSchema>,
  wishlists: Map<string, WishListsSchema>,
  products: Map<string, ProductsSchema>,
  users: Map<string, UsersSchema>,
};
