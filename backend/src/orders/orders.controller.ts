import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common'
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
  findAll() {
    return this.svc.findAll()
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
