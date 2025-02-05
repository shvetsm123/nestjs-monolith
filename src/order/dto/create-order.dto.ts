import { ArrayNotEmpty, IsArray, IsInt, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsArray()
  @ArrayNotEmpty()
  orderProduct: { productId: number }[];
}
