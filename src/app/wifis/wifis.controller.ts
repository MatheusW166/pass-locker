import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WifisService } from './wifis.service';
import { CreateWifiDto } from './dto/create-wifi.dto';
import { UpdateWifiDto } from './dto/update-wifi.dto';

@Controller('wifis')
export class WifisController {
  constructor(private readonly wifisService: WifisService) {}

  @Post()
  create(@Body() createWifiDto: CreateWifiDto) {
    return this.wifisService.create(createWifiDto);
  }

  @Get()
  findAll() {
    return this.wifisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wifisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWifiDto: UpdateWifiDto) {
    return this.wifisService.update(+id, updateWifiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wifisService.remove(+id);
  }
}
