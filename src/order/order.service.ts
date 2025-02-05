import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const { userId, orderProduct } = dto;

    return this.prisma.order.create({
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
        orderProduct: {
          create: orderProduct.map((product) => ({
            productId: product.productId,
          })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        orderProduct: {
          include: {
            Product: true,
          },
        },
        User: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        orderProduct: {
          include: {
            Product: true,
          },
        },
        User: true,
      },
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    const { userId, orderProduct } = dto;

    return this.prisma.order.update({
      where: { id },
      data: {
        User: {
          connect: {
            id: userId,
          },
        },
        orderProduct: {
          deleteMany: {},
          create: orderProduct.map((product) => ({
            productId: product.productId,
          })),
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
