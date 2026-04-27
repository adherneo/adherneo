import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './entities/product.entity'
import { CreateProductDto } from './dto/create-product.dto'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
  ) {}

  create(dto: CreateProductDto): Promise<Product> {
    return this.repo.save(this.repo.create(dto))
  }

  findAll(category?: string, includeAll = false): Promise<Product[]> {
    const where: Record<string, unknown> = includeAll ? {} : { isActive: true }
    if (category) where.category = category
    return this.repo.find({ where, order: { code: 'ASC' } })
  }

  async findOne(id: string): Promise<Product> {
    const p = await this.repo.findOne({ where: { id } })
    if (!p) throw new NotFoundException('Product not found')
    return p
  }

  async update(id: string, dto: Partial<CreateProductDto>): Promise<Product> {
    await this.repo.update(id, dto)
    return this.findOne(id)
  }

  async remove(id: string): Promise<void> {
    await this.repo.update(id, { isActive: false })
  }

  async bulkUpdatePrices(dto: {
    type: 'percentage'
    value: number
  } | {
    type: 'codes'
    updates: { code: string; price: number }[]
  }): Promise<{ updated: number }> {
    if (dto.type === 'percentage') {
      const multiplier = 1 + dto.value / 100
      const products = await this.repo.find({ where: {} })
      await Promise.all(
        products.map((p) =>
          this.repo.update(p.id, { price: Math.round(Number(p.price) * multiplier) })
        )
      )
      return { updated: products.length }
    } else {
      let updated = 0
      await Promise.all(
        dto.updates.map(async ({ code, price }) => {
          const result = await this.repo.update({ code }, { price })
          updated += result.affected ?? 0
        })
      )
      return { updated }
    }
  }
}
