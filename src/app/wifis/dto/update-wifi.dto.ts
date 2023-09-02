import { PartialType } from '@nestjs/mapped-types';
import { CreateWifiDto } from './create-wifi.dto';

export class UpdateWifiDto extends PartialType(CreateWifiDto) {}
