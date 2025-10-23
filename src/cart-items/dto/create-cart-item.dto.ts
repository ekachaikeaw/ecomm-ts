import { IsString, IsInt, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  user_id: string;

  @IsString()
  product_id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
