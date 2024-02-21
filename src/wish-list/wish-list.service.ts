import { Injectable, Logger } from '@nestjs/common';
import { AddToWishListDTO } from '../customers/dto/add-to-wish-list.dto';
import RepositoryProvider from '../repository/repository.provider';
import { CustomersSchema, WishListsSchema } from '../repository/repository.types';
import { WishListAlreadyExists, ProductAlreadyExistsInWishlistError, CustomerDoesNotExistsError } from '../common/error';
import ProductService from '../product/product.service';

@Injectable()
export class WishListService {
  private readonly logger = new Logger(WishListService.name);
  constructor(
    private readonly repository: RepositoryProvider,
    private readonly productService: ProductService,
  ) { }

  create(customerId: string) {
    const wishlist = this.repository.findOne<WishListsSchema>('wishlists', { customerId });
    if (!wishlist) {
      return this.repository.create<WishListsSchema>('wishlists', {
        customerId,
        products: [],
      });
    } else {
      throw new WishListAlreadyExists();
    }
  }

  async addProduct(customerId: string, productId: string) {
    this.logger.log(`Adding product ${productId} to ${customerId} wish list.`)

    const wishlist = this.findOrCreate(customerId);
    const hasProduct = wishlist.products.find(({ id }) => id === productId);

    if (hasProduct) {
      throw new ProductAlreadyExistsInWishlistError();
    }

    this.logger.log('Adding product to new wishlist!');
    this.logger.debug(productId);

    this.logger.log('Getting product detail of product.');
    const productDetail = await this.productService.getProductDetail(productId);
    this.logger.debug(productDetail);

    return this.repository.update<WishListsSchema>('wishlists', wishlist.id, {
      customerId: customerId,
      products: wishlist.products.concat([productDetail]),
    });
  }

  private findOrCreate(customerId: string) {
    let wishlist = this.repository.findOne<WishListsSchema>('wishlists', { customerId });
    
    if (!wishlist) {
      const customer = this.repository.findById<CustomersSchema>('customers', customerId);
      if (!customer) {
        throw new CustomerDoesNotExistsError();  
      } else {
        wishlist = this.create(customerId);
      }
    }

    return wishlist;
  }

  findAll() {
    return this.repository.findAll('wishlists');
  }

  findByCustomerId(customerId: string) {
    const wishlist = this.repository.findOne<WishListsSchema>('wishlists', { customerId });
    const productsView = wishlist.products.map((product) => {
      const outputProduct = Object.assign({}, product);
      if (!product.reviewScore) {
        delete outputProduct.reviewScore; 
      }
      
      return outputProduct;
    });

    return Object.assign(wishlist, { products: productsView });
  }

  findOne(id: string) {
    return this.repository.findById('wishlists', id);
  }

  removeProduct(customerId: string, productId: string) {
    const wishlist = this.repository.findOne<WishListsSchema>('wishlists', { customerId });

    return this.repository.update<WishListsSchema>('wishlists', wishlist.id, {
      customerId: customerId,
      products: wishlist.products.filter(({ id }) => id !== productId),
    });
  }
}
