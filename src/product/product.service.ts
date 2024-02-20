import ProductClient from "./clients/product.client";
import ProductDTO from "./dto/product-client.dto";
import { Injectable, Logger } from "@nestjs/common";
import { ProductsSchema } from "../repository/repository.types";
import RepositoryProvider from "../repository/repository.provider";

@Injectable()
export default class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly repository: RepositoryProvider,
    private readonly productClient: ProductClient) { }

  async getProductDetail(id: string): Promise<ProductsSchema> {
    const product = this.repository.findOne<ProductsSchema>('products', { id });
    if (product) {
      return Promise.resolve(product);
    } else {
      return this.findAndSaveLocal(id, 1);
    }
  }

  private async findAndSaveLocal(id: string, page: number): Promise<ProductsSchema> {
    this.logger.log(`Finding product ${id} on page ${page}`);
    const products = await this.productClient.findProducts(page);
    let foundProduct: ProductsSchema;

    products.forEach(product => {
      const created  = this.repository.create<ProductsSchema>('products', {
        brand: product.brand,
        id: product.id,
        image: product.image,
        price: product.price,
        title: product.title,
        reviewScore: product.reviewScore ? Number.parseFloat(product.reviewScore) : null,
      }, false);

      if (product.id === id) {
        foundProduct = created;
      }
    });

    if (foundProduct) {
      this.logger.log(`Product found on page ${page}!`);
      return foundProduct;
    }

    return this.findAndSaveLocal(id, page++);
  }
}