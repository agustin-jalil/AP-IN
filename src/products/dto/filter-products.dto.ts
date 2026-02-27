// src/products/dto/filter-products.dto.ts
import {
  IsOptional,
  IsEnum,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Categoria } from '@prisma/client';

export class FilterProductsDto {
  @IsOptional()
  @IsEnum(Categoria)
  categoria?: Categoria;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  memoria?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  usado?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  stockDisponible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;
}