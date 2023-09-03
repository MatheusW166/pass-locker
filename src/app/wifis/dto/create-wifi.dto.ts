import { ValidateString } from '@/decorators/validation';

export class CreateWifiDto {
  @ValidateString()
  title: string;

  @ValidateString()
  network: string;

  @ValidateString()
  password: string;
}
