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

export class WishListAlreadyExists extends Error {
  constructor() {
    super('The customer cannot have more than one wishlist.');
  }
}