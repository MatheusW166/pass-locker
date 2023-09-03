import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { ParamId } from '@/decorators/validation';
import { UserId } from '@/decorators/auth';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto, @UserId() userId: number) {
    return this.cardsService.create(createCardDto, userId);
  }

  @Get(':id')
  findOne(@ParamId() id: number, @UserId() userId: number) {
    return this.cardsService.findByIdOrThrow(id, userId);
  }

  @Delete(':id')
  remove(@ParamId() id: number, @UserId() userId: number) {
    return this.cardsService.remove(id, userId);
  }
}
