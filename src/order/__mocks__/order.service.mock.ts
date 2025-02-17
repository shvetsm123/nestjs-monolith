export const orderServiceMock = {
  create: jest.fn().mockResolvedValue({
    id: 1,
    userId: 1,
    orderProduct: [{ productId: 1 }],
    isPaid: false,
    totalAmount: 5000,
  }),
  findAll: jest.fn().mockResolvedValue([
    {
      id: 1,
      userId: 1,
      orderProduct: [{ productId: 1 }],
      isPaid: false,
      totalAmount: 5000,
    },
  ]),
};

export const prismaMock = {
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

export const stripeMock = {
  paymentIntents: {
    create: jest.fn(),
  },
};

export const redisMock = {
  get: jest.fn(),
  setex: jest.fn(),
};
