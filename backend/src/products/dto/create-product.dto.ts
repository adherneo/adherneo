import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator'

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
  imgUrl?: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean
}
