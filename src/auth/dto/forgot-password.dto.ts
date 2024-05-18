import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  email: string;
}
