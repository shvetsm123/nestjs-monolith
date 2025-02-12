import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import Redis from 'ioredis';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    @Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe,
  ) {}

  async create(dto: CreateOrderDto) {
    const { userId, orderProduct, isPaid, paymentIntentId, totalAmount } = dto;

    await this.redisClient.del('orders_all');

    let createdPaymentIntentId = paymentIntentId;
    if (!isPaid) {
      const paymentIntent = await this.stripeClient.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        payment_method: 'pm_card_visa',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });
      createdPaymentIntentId = paymentIntent.id;
    }

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
        totalAmount,
        isPaid,
        paymentIntentId: createdPaymentIntentId,
      },
    });
  }

  async findAll() {
    const cacheKey = 'orders_all';

    const cachedOrders = await this.redisClient.get(cacheKey);
    if (cachedOrders) {
      return JSON.parse(cachedOrders);
    }

    const orders = await this.prisma.order.findMany({
      include: {
        orderProduct: {
          include: {
            Product: true,
          },
        },
        User: true,
      },
    });

    await this.redisClient.setex(cacheKey, 3600, JSON.stringify(orders));
    return orders;
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

  async updatePaymentStatus(paymentIntentId: string, isPaid: boolean) {
    return this.prisma.order.update({
      where: { paymentIntentId },
      data: { isPaid },
    });
  }
}
