import { Injectable, Logger } from '@nestjs/common';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';
import DatabaseProvider, { CustomerTable, WishListTable } from 'src/database/database-provider';
import { CustomerDoesNotExistsError, ProductAlreadyExistsInWishlistError } from 'src/common/error';
import ProductService from 'src/product/product.service';

@Injectable()
export class WishListService {
  private readonly logger = new Logger(WishListService.name);
  constructor(
    private readonly database: DatabaseProvider,
    private readonly productService: ProductService,
  ) { }

  async create(createWishListDto: CreateWishListDto) {
    const { customerId, productId } = createWishListDto;
    this.logger.log(`Adding product ${productId} to ${customerId} wish list.`)

    const customer = this.database.selectById<CustomerTable>('customers', customerId);
    if (!customer) {
      throw new CustomerDoesNotExistsError();
    }

    this.logger.log('Customer exists! Identifying wishlist');

    const products = this.database.selectWhere<WishListTable>('wishlists', {
      customerId: customerId,
      productId: productId,
    });

    if (products.length > 0) {
      throw new ProductAlreadyExistsInWishlistError();
    }

    this.logger.log('Adding product to new wishlist!');

    const productDetail = await this.productService.getProductDetail(productId);

    return this.database.insertInto<WishListTable>('wishlists', {
      customerId,
      productId,
      productBrand: productDetail.brand,
      productPrice: productDetail.price,
      productTitle: productDetail.title,
      productImage: productDetail.image
    });
  }

  findAll() {
    return this.database.select('wishlists');
  }

  findByCustomerId(customerId: string) {
    const customer = this.database.selectById<CustomerTable>('customers', customerId);
    this.logger.log('Found customer!', customer);
    const wishlist = this.database.selectWhere<WishListTable>('wishlists', { customerId });
    return {
      customer: {
        id: customerId,
        name: customer.name,
      },
      products: wishlist.map((item) => ({
        id: item.id,
        price: item.productPrice,
        title: item.productTitle,
        image: item.productImage,
        brand: item.productBrand,
      })),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} wishList`;
  }

  update(id: number, updateWishListDto: UpdateWishListDto) {
    return `This action updates a #${id} wishList`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishList`;
  }
}
