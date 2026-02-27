// src/products/dto/create-product.dto.ts
import {
  IsString,
  IsEnum,
  IsDecimal,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Categoria } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  modelo: string;

  @IsEnum(Categoria, {
    message: `La categoría debe ser uno de: ${Object.values(Categoria).join(', ')}`,
  })
  categoria: Categoria;

  @IsString()
  @MinLength(1)
  @MaxLength(20)
  memoria: string;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  color: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número decimal válido' })
  @Min(0)
  @Type(() => Number)
  precio: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  bateria?: number;

  @IsOptional()
  @IsBoolean()
  usado?: boolean;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @IsOptional()
  @IsString()
  proveedorId?: string;

  @IsOptional()
  @IsString()
  sucursalId?: string;
}