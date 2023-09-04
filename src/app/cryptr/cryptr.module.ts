import { Module } from '@nestjs/common';
import { CryptrService } from './cryptr.service';
import { BcryptService } from './bcrypt.service';

@Module({
  exports: [CryptrService, BcryptService],
  providers: [CryptrService, BcryptService],
})
export class CryptrModule {}
