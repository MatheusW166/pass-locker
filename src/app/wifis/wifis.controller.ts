import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { WifisService } from './wifis.service';
import { CreateWifiDto } from './dto/create-wifi.dto';
import { UserId } from '@/decorators/auth';
import { ParamId } from '@/decorators/validation';

@Controller('wifis')
export class WifisController {
  constructor(private readonly wifisService: WifisService) {}

  @Post()
  create(@Body() createWifiDto: CreateWifiDto, @UserId() userId: number) {
    return this.wifisService.create(createWifiDto, userId);
  }

  @Get(':id')
  findOne(@ParamId() id: number, @UserId() userId: number) {
    return this.wifisService.findByIdOrThrow(id, userId);
  }

  @Delete(':id')
  remove(@ParamId() id: number, @UserId() userId: number) {
    return this.wifisService.remove(id, userId);
  }
}
