import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class EditImageDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @IsBoolean()
  @IsOptional()
  isClippable?: boolean;
}
