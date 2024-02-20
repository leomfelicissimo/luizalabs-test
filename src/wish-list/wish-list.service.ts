import { Injectable, Logger } from '@nestjs/common';
import { AddToWishListDTO } from '../customers/dto/add-to-wish-list.dto';
import { CustomerDoesNotExistsError, ProductAlreadyExistsInWishlistError, WishListAlreadyExists } from 'src/common/error';
import ProductService from 'src/product/product.service';
import RepositoryProvider from 'src/repository/repository.provider';
import { CustomersSchema, WishListsSchema } from 'src/repository/repository.types';

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

    const productDetail = await this.productService.getProductDetail(productId);

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
    return this.repository.findOne<WishListsSchema>('wishlists', { customerId });
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
