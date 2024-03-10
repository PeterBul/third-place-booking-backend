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
  pickupDate: string;

  @IsDateString()
  @IsNotEmpty()
  returnDate: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsNotEmpty()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    return value.split(',').map((id) => parseInt(id, 10));
  })
  itemIds: number[];
}
