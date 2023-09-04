import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';
import { CryptrService } from '@app/cryptr/cryptr.service';
import { Card } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly cryptr: CryptrService,
  ) {}

  async create(createCardDto: CreateCardDto, userId: number) {
    const card = await this.cardsRepository.findByTitleAndUserId(
      createCardDto.title,
      userId,
    );
    if (card) throw new ConflictException();
    const encryptedCard = this.encryptCardFields(createCardDto);
    return this.cardsRepository.create(encryptedCard, userId);
  }

  async findByIdOrThrow(id: number, userId: number) {
    const card = await this.cardsRepository.findById(id);
    if (!card) throw new NotFoundException();
    if (card.userId !== userId) throw new ForbiddenException();
    return this.decryptCardFields(card);
  }

  async remove(id: number, userId: number) {
    await this.findByIdOrThrow(id, userId);
    return this.cardsRepository.remove(id);
  }

  encryptCardFields(card: CreateCardDto) {
    return {
      ...card,
      code: this.cryptr.encrypt(card.code),
      number: this.cryptr.encrypt(card.number),
    };
  }

  decryptCardFields(card: Card) {
    return {
      ...card,
      code: this.cryptr.decrypt(card.code),
      number: this.cryptr.decrypt(card.number),
    };
  }
}
