import { Module } from '@nestjs/common';
import { WifisService } from './wifis.service';
import { WifisController } from './wifis.controller';

@Module({
  controllers: [WifisController],
  providers: [WifisService],
})
export class WifisModule {}
