import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { PrismaModule } from '@app/prisma/prisma.module';
import { CredentialsRepository } from './credentials.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
})
export class CredentialsModule {}
