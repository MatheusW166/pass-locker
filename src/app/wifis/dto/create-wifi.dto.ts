import { ValidateString } from '@/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWifiDto {
  @ApiProperty()
  @ValidateString()
  title: string;

  @ApiProperty()
  @ValidateString()
  network: string;

  @ApiProperty()
  @ValidateString()
  password: string;
}
