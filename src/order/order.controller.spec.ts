import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { orderServiceMock } from './__mocks__/order.service.mock';
import * as request from 'supertest';
import { createOrderDto } from './__mocks__/order.data.mock';

describe('OrderController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('Should create an order (POST /order)', async () => {
    return request(app.getHttpServer())
      .post('/order')
      .send(createOrderDto)
      .expect(HttpStatus.CREATED)
      .expect({
        id: 1,
        userId: 1,
        orderProduct: [{ productId: 1 }],
        isPaid: false,
        totalAmount: 5000,
      });
  });

  it('Should get all orders (GET /order)', async () => {
    return request(app.getHttpServer())
      .get('/order')
      .expect(HttpStatus.OK)
      .expect([
        {
          id: 1,
          userId: 1,
          orderProduct: [{ productId: 1 }],
          isPaid: false,
          totalAmount: 5000,
        },
      ]);
  });

  afterAll(async () => {
    await app.close();
  });
});
