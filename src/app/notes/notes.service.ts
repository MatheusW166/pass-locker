import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesRepository } from './notes.repository';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    const note = await this.notesRepository.findByTitleAndUserId(
      createNoteDto.title,
      userId,
    );
    if (note) throw new ConflictException();
    return this.notesRepository.create(createNoteDto, userId);
  }

  async findByIdOrThrow(id: number, userId: number) {
    const note = await this.notesRepository.findById(id);
    if (!note) throw new NotFoundException();
    if (note.userId !== userId) throw new ForbiddenException();
    return note;
  }

  async remove(id: number, userId: number) {
    await this.findByIdOrThrow(id, userId);
    return this.notesRepository.remove(id);
  }
}
