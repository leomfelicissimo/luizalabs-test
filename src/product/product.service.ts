import DatabaseProvider, { ProductTable, WishListTable } from "src/database/database-provider"
import ProductClient from "./clients/product.client";
import ProductDTO from "./dto/product-client.dto";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export default class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly database: DatabaseProvider,
    private readonly productClient: ProductClient) { }

  async getProductDetail(externalId: string): Promise<ProductDTO> {
    const products = this.database.selectWhere<ProductTable>('products', { externalId });
    if (products.length > 0) {
      return Promise.resolve(products.at(0) as ProductDTO);
    } else {
      return this.findAndSaveLocal(externalId, 1);
    }
  }

  private async findAndSaveLocal(id: string, page: number): Promise<ProductDTO> {
    this.logger.log(`Finding product ${id} on page ${page}`);
    const products = await this.productClient.findProducts(page);
    let foundProduct: ProductDTO;

    products.forEach(product => {
      this.database.insertInto<ProductTable>('products', {
        brand: product.brand,
        externalId: product.id,
        image: product.image,
        price: product.price,
        title: product.title,
      });

      if (product.id === id) {
        foundProduct = product;
      }
    });

    if (foundProduct) {
      this.logger.log(`Product found on page ${page}!`);
      return foundProduct;
    }

    return this.findAndSaveLocal(id, page++);
  }
}