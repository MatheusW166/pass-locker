import { ValidateString } from '@/decorators/validation';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty()
  @ValidateString()
  title: string;

  @ApiProperty()
  @ValidateString()
  text: string;
}
