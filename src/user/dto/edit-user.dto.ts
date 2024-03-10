import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  firstName?: string;
  @IsString()
  @IsOptional()
  lastName?: string;
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
  @IsBoolean()
  @IsOptional()
  isMemberThirdPlace?: boolean;
  @IsBoolean()
  @IsOptional()
  isMemberBloom?: boolean;
}
