import { CreateOrderDto } from '../dto/create-order.dto';

export const mockPaymentIntent = { id: 'newPaymentIntentId' };

export const createOrderDto: CreateOrderDto = {
  userId: 1,
  orderProduct: [{ productId: 1 }],
  isPaid: false,
  paymentIntentId: 'existingPaymentIntentId',
  totalAmount: 5000,
};

export const mockCreatedOrder = {
  id: 1,
  userId: createOrderDto.userId,
  orderProduct: createOrderDto.orderProduct,
  isPaid: createOrderDto.isPaid,
  paymentIntentId: createOrderDto.paymentIntentId,
  totalAmount: createOrderDto.totalAmount,
};

export const cachedOrders = [{ id: 1, totalAmount: 100 }];

export const ordersFromDb = [
  { id: 1, totalAmount: 100 },
  { id: 2, totalAmount: 200 },
];
