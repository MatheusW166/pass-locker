import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UserId } from '@/decorators/auth';
import { ParamId } from '@/decorators/validation';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @UserId() userId: number) {
    return this.notesService.create(createNoteDto, userId);
  }

  @Get(':id')
  findOne(@ParamId() id: number, @UserId() userId: number) {
    return this.notesService.findByIdOrThrow(id, userId);
  }

  @Delete(':id')
  remove(@ParamId() id: number, @UserId() userId: number) {
    return this.notesService.remove(id, userId);
  }
}
