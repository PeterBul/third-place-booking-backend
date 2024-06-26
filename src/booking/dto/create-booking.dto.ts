import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value).toISOString())
  pickupDate: string;

  @IsDateString()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value).toISOString())
  returnDate: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  itemIds: number[];
}
