import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeedService } from './seed.service'
import { User } from '../users/entities/user.entity'
import { Product } from '../products/entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  providers: [SeedService],
})
export class SeedModule {}
