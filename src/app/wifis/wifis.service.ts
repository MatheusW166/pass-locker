import { Injectable } from '@nestjs/common';
import { CreateWifiDto } from './dto/create-wifi.dto';
import { UpdateWifiDto } from './dto/update-wifi.dto';

@Injectable()
export class WifisService {
  create(createWifiDto: CreateWifiDto) {
    return 'This action adds a new wifi';
  }

  findAll() {
    return `This action returns all wifis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wifi`;
  }

  update(id: number, updateWifiDto: UpdateWifiDto) {
    return `This action updates a #${id} wifi`;
  }

  remove(id: number) {
    return `This action removes a #${id} wifi`;
  }
}
