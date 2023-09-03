import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { NotesRepository } from './notes.repository';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
})
export class NotesModule {}
