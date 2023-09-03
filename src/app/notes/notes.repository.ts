import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createNoteDto: CreateNoteDto, userId: number) {
    return this.prisma.note.create({ data: { ...createNoteDto, userId } });
  }

  findByTitleAndUserId(title: string, userId: number) {
    return this.prisma.note.findUnique({
      where: { title_userId: { title, userId } },
    });
  }

  findById(id: number) {
    return this.prisma.note.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.note.delete({ where: { id } });
  }
}
