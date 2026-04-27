import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'

@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.svc.create(dto)
  }

  @Get()
  findAll(@Query('category') category?: string, @Query('all') all?: string) {
    return this.svc.findAll(category, all === 'true')
  }

  @Patch('prices/bulk')
  bulkUpdatePrices(@Body() dto: { type: 'percentage'; value: number } | { type: 'codes'; updates: { code: string; price: number }[] }) {
    return this.svc.bulkUpdatePrices(dto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.svc.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id)
  }
}
