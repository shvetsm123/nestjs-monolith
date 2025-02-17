import { OrderService } from './order.service';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import Redis from 'ioredis';
import { Test, TestingModule } from '@nestjs/testing';
import {
  prismaMock,
  redisMock,
  stripeMock,
} from './__mocks__/order.service.mock';
import {
  cachedOrders,
  createOrderDto,
  mockCreatedOrder,
  mockPaymentIntent,
  ordersFromDb,
} from './__mocks__/order.data.mock';

describe('OrderService', () => {
  let orderService: OrderService;
  let prismaService: PrismaService;
  let stripeClient: Stripe;
  let redisClient: Redis;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: 'STRIPE_CLIENT',
          useValue: stripeMock,
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: redisMock,
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    prismaService = module.get<PrismaService>(PrismaService);
    stripeClient = module.get<Stripe>('STRIPE_CLIENT');
    redisClient = module.get<Redis>('REDIS_CLIENT');
  });

  it('Should create an order', async () => {
    stripeMock.paymentIntents.create = jest
      .fn()
      .mockResolvedValue(mockPaymentIntent);

    prismaMock.order.create = jest.fn().mockResolvedValue(mockCreatedOrder);

    const result = await orderService.create(createOrderDto);

    expect(stripeMock.paymentIntents.create).toHaveBeenCalledWith({
      amount: createOrderDto.totalAmount,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    expect(prismaMock.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          User: { connect: { id: createOrderDto.userId } },
          orderProduct: {
            create: [{ productId: createOrderDto.orderProduct[0].productId }],
          },
          totalAmount: createOrderDto.totalAmount,
          isPaid: createOrderDto.isPaid,
          paymentIntentId: mockPaymentIntent.id,
        }),
      }),
    );

    expect(result).toEqual(mockCreatedOrder);
  });

  it('Should return orders from cache if available', async () => {
    redisMock.get = jest.fn().mockResolvedValue(JSON.stringify(cachedOrders));

    const result = await orderService.findAll();

    expect(redisMock.get).toHaveBeenCalledWith('orders_all');

    expect(result).toEqual(cachedOrders);
  });

  it('Should return all orders from database if not in cache', async () => {
    redisMock.get = jest.fn().mockResolvedValue(null);

    prismaMock.order.findMany = jest.fn().mockResolvedValue(ordersFromDb);

    redisMock.setex = jest.fn();

    const result = await orderService.findAll();
    expect(redisMock.get).toHaveBeenCalledWith('orders_all');

    expect(prismaMock.order.findMany).toHaveBeenCalled();

    expect(redisMock.setex).toHaveBeenCalledWith(
      'orders_all',
      3600,
      JSON.stringify(ordersFromDb),
    );

    expect(result).toEqual(ordersFromDb);
  });
});
