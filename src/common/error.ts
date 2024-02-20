export class ProductAlreadyExistsInWishlistError extends Error {
  constructor() {
    super('The product already exists in your wishlist');
  }
}

export class CustomerDoesNotExistsError extends Error {
  constructor() {
    super('Customer does not exist!');
  }
}