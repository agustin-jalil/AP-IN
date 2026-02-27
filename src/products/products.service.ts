// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.producto.create({
      data: {
        modelo: dto.modelo,
        categoria: dto.categoria,
        memoria: dto.memoria,
        color: dto.color,
        precio: dto.precio,
        bateria: dto.bateria,
        usado: dto.usado ?? false,
        stock: dto.stock,
        ...(dto.proveedorId && { proveedorId: dto.proveedorId }),
        ...(dto.sucursalId && { sucursalId: dto.sucursalId }),
      },
    });
  }

  async findAll(filters: FilterProductsDto) {
    const {
      categoria,
      modelo,
      memoria,
      color,
      usado,
      minPrice,
      maxPrice,
      stockDisponible,
      page = 1,
      limit = 10,
    } = filters;

    const where: Prisma.ProductoWhereInput = {
      ...(categoria && { categoria }),
      ...(modelo && {
        modelo: { contains: modelo, mode: Prisma.QueryMode.insensitive },
      }),
      ...(memoria && { memoria }),
      ...(color && {
        color: { contains: color, mode: Prisma.QueryMode.insensitive },
      }),
      ...(usado !== undefined && { usado }),
      ...(stockDisponible && { stock: { gt: 0 } }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        precio: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const skip = (page - 1) * limit;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.producto.count({ where }),
      this.prisma.producto.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.producto.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Producto con id "${id}" no encontrado`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id); // Lanza 404 si no existe

    return this.prisma.producto.update({
      where: { id },
      data: {
        ...(dto.modelo !== undefined && { modelo: dto.modelo }),
        ...(dto.categoria !== undefined && { categoria: dto.categoria }),
        ...(dto.memoria !== undefined && { memoria: dto.memoria }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.precio !== undefined && { precio: dto.precio }),
        ...(dto.bateria !== undefined && { bateria: dto.bateria }),
        ...(dto.usado !== undefined && { usado: dto.usado }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
        ...(dto.proveedorId !== undefined && { proveedorId: dto.proveedorId }),
        ...(dto.sucursalId !== undefined && { sucursalId: dto.sucursalId }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Lanza 404 si no existe
    await this.prisma.producto.delete({ where: { id } });
    return { message: `Producto "${id}" eliminado correctamente` };
  }
}