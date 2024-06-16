import { IsString, IsOptional, IsNumber } from 'class-validator';

export class EditItemDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  imageId?: number;

  @IsNumber()
  @IsOptional()
  count?: number;
}
