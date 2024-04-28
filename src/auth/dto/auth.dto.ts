import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return value;
  })
  isMemberThirdPlace: boolean;

  @IsString()
  @IsOptional()
  name?: string;
}
