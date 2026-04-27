import { Type } from 'class-transformer'
import {
  IsEmail, IsNotEmpty, IsOptional, IsString,
  IsArray, ValidateNested, IsInt, Min, IsNumber,
} from 'class-validator'

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productCode: string

  @IsString()
  @IsNotEmpty()
  productName: string

  @IsString()
  @IsNotEmpty()
  size: string

  @IsInt()
  @Min(1)
  quantity: number

  @IsNumber()
  @IsOptional()
  unitPrice?: number

  @IsString()
  @IsOptional()
  productId?: string
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string

  @IsEmail()
  customerEmail: string

  @IsString()
  @IsOptional()
  customerPhone?: string

  @IsString()
  @IsOptional()
  notes?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]

  @IsString()
  @IsOptional()
  userId?: string
}
