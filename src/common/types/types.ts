export interface IUser {
  id: string;
  email: string;
}

export interface IProductWithBrand {
  id: number;
  title: string;
  description: string;
  brand: {
    title: string;
  };
}
