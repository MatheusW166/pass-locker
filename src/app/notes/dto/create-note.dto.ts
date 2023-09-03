import { ValidateString } from '@/decorators/validation';

export class CreateNoteDto {
  @ValidateString()
  title: string;

  @ValidateString()
  text: string;
}
