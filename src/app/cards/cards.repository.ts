import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class CardsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCardDto: CreateCardDto, userId: number) {
    return this.prismaService.card.create({
      data: { ...createCardDto, userId },
    });
  }

  findByTitleAndUserId(title: string, userId: number) {
    return this.prismaService.card.findUnique({
      where: { title_userId: { title, userId } },
    });
  }

  findById(id: number) {
    return this.prismaService.card.findUnique({
      where: { id },
    });
  }

  remove(id: number) {
    return this.prismaService.card.delete({ where: { id } });
  }
}
