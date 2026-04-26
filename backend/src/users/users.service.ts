import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.repo.findOne({ where: { email: dto.email } })
    if (exists) throw new ConflictException('Email already registered')
    const user = this.repo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash: await bcrypt.hash(dto.password, 10),
    })
    return this.repo.save(user)
  }

  findAll(): Promise<User[]> {
    return this.repo.find({ select: ['id', 'name', 'email', 'phone', 'role', 'createdAt'] })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('User not found')
    return user
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } })
  }
}
