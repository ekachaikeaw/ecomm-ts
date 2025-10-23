import { IsString, IsInt, Min, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
