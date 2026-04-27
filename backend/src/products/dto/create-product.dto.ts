import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  category: string

  @IsArray()
  @IsOptional()
  sizes?: string[]

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  imgUrl?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number

  @IsArray()
  @IsOptional()
  images?: string[]

  @IsArray()
  @IsOptional()
  bodyParts?: string[]

  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
