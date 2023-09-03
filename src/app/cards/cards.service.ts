import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { CardsRepository } from './cards.repository';
import Cryptr from 'cryptr';

@Injectable()
export class CardsService {
  constructor(private readonly cardsRepository: CardsRepository) {}

  async create(createCardDto: CreateCardDto, userId: number) {
    const card = await this.cardsRepository.findByTitleAndUserId(
      createCardDto.title,
      userId,
    );
    if (card) throw new ConflictException();

    const { code, number } = createCardDto;
    const crypt = new Cryptr(process.env.JWT_SECRET);
    createCardDto = {
      ...createCardDto,
      code: crypt.encrypt(code),
      number: crypt.encrypt(number),
    };
    return this.cardsRepository.create(createCardDto, userId);
  }

  async findByIdOrThrow(id: number, userId: number) {
    const card = await this.cardsRepository.findById(id);
    if (!card) throw new NotFoundException();
    if (card.userId !== userId) throw new ForbiddenException();

    const crypt = new Cryptr(process.env.JWT_SECRET);
    const { code, number } = card;
    return {
      ...card,
      code: crypt.decrypt(code),
      number: crypt.decrypt(number),
    };
  }

  async remove(id: number, userId: number) {
    await this.findByIdOrThrow(id, userId);
    return this.cardsRepository.remove(id);
  }
}
