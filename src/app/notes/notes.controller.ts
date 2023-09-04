import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UserId } from '@/decorators/auth';
import { ParamId } from '@/decorators/validation';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Creates a note' })
  @ApiResponse({
    status: 201,
    description: 'Created note',
  })
  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @UserId() userId: number) {
    return this.notesService.create(createNoteDto, userId);
  }

  @ApiOperation({ summary: 'Retrieves a note' })
  @ApiResponse({
    status: 200,
    description: 'Note that matches the given id',
  })
  @Get(':id')
  findOne(@ParamId() id: number, @UserId() userId: number) {
    return this.notesService.findByIdOrThrow(id, userId);
  }

  @ApiOperation({ summary: 'Deletes a note' })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@ParamId() id: number, @UserId() userId: number) {
    return this.notesService.remove(id, userId);
  }
}
