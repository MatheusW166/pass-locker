import { IsEmail, IsStrongPassword } from 'class-validator';
import { ValidateString } from '@/decorators/validation';

export class CreateUserDto {
  @ValidateString()
  name: string;

  @ValidateString()
  @IsEmail()
  email: string;

  @ValidateString()
  @IsStrongPassword({
    minLength: 10,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
