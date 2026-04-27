import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { Order } from './entities/order.entity'
import { OrderItem } from './entities/order-item.entity'
import { CreateOrderDto } from './dto/create-order.dto'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)     private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo:  Repository<OrderItem>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepo.create({
      customerName:  dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      notes:         dto.notes,
      items: dto.items.map((i) =>
        this.itemRepo.create({
          productCode: i.productCode,
          productName: i.productName,
          size:        i.size,
          quantity:    i.quantity,
          unitPrice:   i.unitPrice ?? null,
          ...(i.productId ? { product: { id: i.productId } as any } : {}),
        }),
      ),
    })
    if (dto.userId) order.user = { id: dto.userId } as any
    return this.orderRepo.save(order)
  }

  async findAllPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: Order[]; total: number; pages: number }> {
    const where = search?.trim()
      ? [
          { customerName:  ILike(`%${search}%`) },
          { customerEmail: ILike(`%${search}%`) },
          { customerPhone: ILike(`%${search}%`) },
        ]
      : undefined

    const [data, total] = await this.orderRepo.findAndCount({
      where,
      order:     { createdAt: 'DESC' },
      relations: ['items'],
      skip:      (page - 1) * limit,
      take:      limit,
    })
    return { data, total, pages: Math.ceil(total / limit) }
  }

  findByUser(userId: string): Promise<Order[]> {
    return this.orderRepo.find({
      where:     { user: { id: userId } },
      order:     { createdAt: 'DESC' },
      relations: ['items'],
    })
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] })
    if (!order) throw new NotFoundException('Order not found')
    return order
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order> {
    await this.orderRepo.update(id, { status })
    return this.findOne(id)
  }
}
