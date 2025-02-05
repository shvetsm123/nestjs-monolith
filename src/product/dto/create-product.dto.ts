import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsInt()
  brandId?: number;
}
