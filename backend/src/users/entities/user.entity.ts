import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm'
import { Order } from '../../orders/entities/order.entity'

export type UserRole = 'admin' | 'client'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 150 })
  name: string

  @Column({ length: 200, unique: true })
  email: string

  @Column({ length: 50, nullable: true })
  phone: string

  @Column({ name: 'password_hash', length: 200 })
  passwordHash: string

  @Column({ type: 'varchar', length: 20, default: 'client' })
  role: UserRole

  @OneToMany(() => Order, (o) => o.user)
  orders: Order[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
