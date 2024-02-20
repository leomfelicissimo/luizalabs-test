import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put, Query, UseGuards } from '@nestjs/common';
import { CustomerAlreadyExists, CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Response } from 'express';
import { WishListService } from 'src/wish-list/wish-list.service';
import { AddToWishListDTO } from './dto/add-to-wish-list.dto';
import { RemoveFromWishListDTO } from './dto/remove-from-wish-list.dto';
import AuthGuard from 'src/auth/auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly wishListService: WishListService
  ) { }

  // The best approach with Guards, is to set a Global guard, and override when is public
  // I'm keeping it simple.

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/wishlists')
  removeFromWishlist(@Param('id') id: string, @Body() removeFromWishListDTO: RemoveFromWishListDTO) {
    return this.wishListService.removeProduct(id, removeFromWishListDTO.productId);
  }

  @UseGuards(AuthGuard)
  @Get(':id/wishlists/')
  findWishList(@Param('id') id: string) {
    return this.wishListService.findByCustomerId(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id/wishlists')
  async addToWishList(
    @Param('id') id: string,
    @Body() addToWishList: AddToWishListDTO,
    @Res() res
  ) {
    try {
      const added = await this.wishListService.addProduct(id, addToWishList.productId);
      res.status(HttpStatus.OK).json(added);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }
  }
}
