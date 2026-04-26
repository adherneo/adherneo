import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { OrderItem } from './order-item.entity'

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, (u) => u.orders, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'customer_name', length: 150 })
  customerName: string

  @Column({ name: 'customer_email', length: 200 })
  customerEmail: string

  @Column({ name: 'customer_phone', length: 50, nullable: true })
  customerPhone: string

  @Column({ type: 'text', nullable: true })
  notes: string

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: OrderStatus

  @OneToMany(() => OrderItem, (i) => i.order, { cascade: true, eager: true })
  items: OrderItem[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
