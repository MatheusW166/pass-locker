import { Module } from '@nestjs/common';
import { WifisService } from './wifis.service';
import { WifisController } from './wifis.controller';
import { PrismaModule } from '@app/prisma/prisma.module';
import { WifisRepository } from './wifis.repository';

@Module({
  imports: [PrismaModule],
  controllers: [WifisController],
  providers: [WifisService, WifisRepository],
})
export class WifisModule {}
