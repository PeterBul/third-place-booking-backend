import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GetItemsDto {
  @IsString()
  @IsOptional()
  @IsDateString(undefined, { message: 'from must be a valid date' })
  from?: string;
}
