import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsArray()
  @ArrayNotEmpty()
  orderProduct: { productId: number }[];

  @IsBoolean()
  isPaid: boolean;

  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @IsInt()
  totalAmount: number;
}
