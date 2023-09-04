import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { WifisService } from './wifis.service';
import { CreateWifiDto } from './dto/create-wifi.dto';
import { UserId } from '@/decorators/auth';
import { ParamId } from '@/decorators/validation';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('wifis')
@Controller('wifis')
export class WifisController {
  constructor(private readonly wifisService: WifisService) {}

  @ApiOperation({ summary: 'Creates a wifi' })
  @ApiResponse({
    status: 201,
    description: 'Created wifi',
  })
  @Post()
  create(@Body() createWifiDto: CreateWifiDto, @UserId() userId: number) {
    return this.wifisService.create(createWifiDto, userId);
  }

  @ApiOperation({ summary: 'Retrieves a wifi' })
  @ApiResponse({
    status: 200,
    description: 'Wifi that matches the given id',
  })
  @Get(':id')
  findOne(@ParamId() id: number, @UserId() userId: number) {
    return this.wifisService.findByIdOrThrow(id, userId);
  }

  @ApiOperation({ summary: 'Deletes a wifi' })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@ParamId() id: number, @UserId() userId: number) {
    return this.wifisService.remove(id, userId);
  }
}
