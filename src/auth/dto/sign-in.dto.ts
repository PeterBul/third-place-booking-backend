import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
