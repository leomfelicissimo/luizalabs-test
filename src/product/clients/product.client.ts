import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { AxiosError, AxiosResponse } from "axios";
import { Observable, catchError, firstValueFrom } from "rxjs";
import ProductDTO from "../dto/product-client.dto";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export default class ProductClient {
  private readonly logger = new Logger(ProductClient.name);

  private readonly PRODUCT_API_URL: string;

  constructor(private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.PRODUCT_API_URL = this.configService.get('PRODUCT_API_URL');
  }

  async findProductById(id: string) {
    const apiUrl = `${this.PRODUCT_API_URL}/${id}`;
    const { data } = await firstValueFrom(this.httpService.get(apiUrl));
    this.logger.log('data: ', data);
    return data;
  }

  async findProducts(page: number): Promise<ProductDTO[]> {
    const apiUrl = `${this.PRODUCT_API_URL}/?page=${page}`;
    const { data } = await firstValueFrom(this.httpService.get(apiUrl));
    return data.products;
  }
}