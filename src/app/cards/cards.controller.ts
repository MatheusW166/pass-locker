import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ParamId } from '@/decorators/validation';
import { UserId } from '@/decorators/auth';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('cards')
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: 'Creates a card' })
  @ApiResponse({ status: 201, description: 'Created card' })
  @Post()
  create(@Body() createCardDto: CreateCardDto, @UserId() userId: number) {
    return this.cardsService.create(createCardDto, userId);
  }

  @ApiOperation({ summary: 'Retrieves a card' })
  @ApiResponse({
    status: 200,
    description: 'Card that matches the given id',
  })
  @Get(':id')
  findOne(@ParamId() id: number, @UserId() userId: number) {
    return this.cardsService.findByIdOrThrow(id, userId);
  }

  @ApiOperation({ summary: 'Deletes a card' })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@ParamId() id: number, @UserId() userId: number) {
    return this.cardsService.remove(id, userId);
  }
}
