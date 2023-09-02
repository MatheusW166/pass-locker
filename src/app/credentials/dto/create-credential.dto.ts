import { ValidateString } from '@/decorators/validation';
import { IsUrl } from 'class-validator';

export class CreateCredentialDto {
  @ValidateString()
  title: string;

  @ValidateString()
  @IsUrl()
  url: string;

  @ValidateString()
  username: string;

  @ValidateString()
  password: string;
}
