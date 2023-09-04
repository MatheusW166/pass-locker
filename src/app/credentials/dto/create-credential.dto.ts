import { ValidateString } from '@/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @ApiProperty()
  @ValidateString()
  title: string;

  @ApiProperty()
  @ValidateString()
  @IsUrl()
  url: string;

  @ApiProperty()
  @ValidateString()
  username: string;

  @ApiProperty()
  @ValidateString()
  password: string;
}
