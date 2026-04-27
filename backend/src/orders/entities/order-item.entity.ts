import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { Order } from './order.entity'
import { Product } from '../../products/entities/product.entity'

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column({ name: 'product_code', length: 20 })
  productCode: string

  @Column({ name: 'product_name', length: 200 })
  productName: string

  @Column({ length: 20 })
  size: string

  @Column({ type: 'int' })
  quantity: number

  @Column({ name: 'unit_price', type: 'numeric', precision: 12, scale: 2, nullable: true, default: null })
  unitPrice: number | null
}
