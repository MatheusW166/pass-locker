import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { PrismaModule } from '@app/prisma/prisma.module';
import { CredentialsRepository } from './credentials.repository';
import { CryptrModule } from '@app/cryptr/cryptr.module';

@Module({
  imports: [PrismaModule, CryptrModule],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
})
export class CredentialsModule {}
