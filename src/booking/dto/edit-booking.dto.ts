import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsArray,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class EditBookingDto {
  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsOptional()
  pickupDate?: string;

  @IsDateString()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsOptional()
  returnDate?: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  itemIds?: number[];

  @IsOptional()
  @IsBoolean()
  isPickedUp?: boolean;

  @IsOptional()
  @IsBoolean()
  isReturned?: boolean;
}
