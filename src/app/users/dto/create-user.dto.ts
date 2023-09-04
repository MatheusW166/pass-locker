import { IsEmail, IsStrongPassword } from 'class-validator';
import { ValidateString } from '@/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @ValidateString()
  name: string;

  @ApiProperty()
  @ValidateString()
  @IsEmail()
  email: string;

  @ApiProperty()
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
