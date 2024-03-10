import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;
  @IsString()
  @IsOptional()
  alt?: string;
}
