import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  user_id: string;

  @IsString()
  product_id: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  status?: string;
}
