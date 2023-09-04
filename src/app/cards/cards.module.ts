import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { CardsRepository } from './cards.repository';
import { PrismaModule } from '@app/prisma/prisma.module';
import { CryptrModule } from '@app/cryptr/cryptr.module';

@Module({
  imports: [PrismaModule, CryptrModule],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
})
export class CardsModule {}
