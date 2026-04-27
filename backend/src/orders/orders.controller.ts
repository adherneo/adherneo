import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import type { Order } from './entities/order.entity'

@Controller('orders')
export class OrdersController {
  constructor(private readonly svc: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.svc.create(dto)
  }

  @Get()
  findAll(
    @Query('page')   page   = '1',
    @Query('limit')  limit  = '20',
    @Query('search') search = '',
  ) {
    return this.svc.findAllPaginated(
      Math.max(1, parseInt(page,  10) || 1),
      Math.min(100, parseInt(limit, 10) || 20),
      search,
    )
  }

  @Get('by-user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.svc.findByUser(userId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id)
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: Order['status']) {
    return this.svc.updateStatus(id, status)
  }
}
