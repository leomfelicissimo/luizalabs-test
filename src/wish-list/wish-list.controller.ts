import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Query } from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';
import { CustomerDoesNotExistsError } from 'src/common/error';

@Controller('wishlist')
export class WishListController {
  constructor(private readonly wishListService: WishListService) { }

  @Post()
  async create(@Body() createWishListDto: CreateWishListDto, @Res() res) {
    try {
      const created = await this.wishListService.create(createWishListDto)
      res.status(HttpStatus.CREATED).json(created);
    } catch (e) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: e.message });
    }

  }

  @Get()
  findByCustomer(@Query('customerId') customerId: string) {
    return this.wishListService.findByCustomerId(customerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishListDto: UpdateWishListDto) {
    return this.wishListService.update(+id, updateWishListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishListService.remove(+id);
  }
}
