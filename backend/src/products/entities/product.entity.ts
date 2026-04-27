import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 20 })
  code: string

  @Column({ length: 200 })
  name: string

  @Column({ length: 50 })
  category: string

  @Column({ type: 'jsonb', default: [] })
  sizes: string[]

  @Column({ type: 'text', nullable: true })
  description: string | null

  @Column({ name: 'img_url', length: 300, nullable: true })
  imgUrl: string | null

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  price: number

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
