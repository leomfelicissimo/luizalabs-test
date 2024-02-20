import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put, Query } from '@nestjs/common';
import { CustomerAlreadyExists, CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Response } from 'express';
import { WishListService } from 'src/wish-list/wish-list.service';
import { AddToWishListDTO } from './dto/add-to-wish-list.dto';
import { RemoveFromWishListDTO } from './dto/remove-from-wish-list.dto';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly wishListService: WishListService
  ) { }

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @Res() res: Response) {
    try {
      const inserted = this.customersService.create(createCustomerDto);
      res.status(HttpStatus.CREATED).json(inserted);
    } catch (e) {
      if (e instanceof CustomerAlreadyExists) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
      }
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @Delete(':id/wishlists')
  removeFromWishlist(@Param('id') id: string, @Body() removeFromWishListDTO: RemoveFromWishListDTO) {
    return this.wishListService.removeProduct(id, removeFromWishListDTO.productId);
  }

  @Get(':id/wishlists/')
  findWishList(@Param('id') id: string) {
    return this.wishListService.findByCustomerId(id);
  }

  @Put(':id/wishlists')
  async addToWishList(
    @Param('customerId') customerId: string,
    @Body() addToWishList: AddToWishListDTO,
    @Res() res
  ) {
    try {
      const added = await this.wishListService.addProduct(customerId, addToWishList.productId);
      res.status(HttpStatus.OK).json(added);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
