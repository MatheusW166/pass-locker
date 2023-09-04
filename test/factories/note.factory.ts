import { PrismaService } from '@app/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { CreateNoteDto } from '@app/notes/dto/create-note.dto';
import { IFactory } from './ifactory.factory';
import { Note } from '@prisma/client';

export class NoteFactory
  extends CreateNoteDto
  implements IFactory<CreateNoteDto, Note>
{
  constructor() {
    super();
    this.build();
  }

  build(props?: Partial<CreateNoteDto>) {
    this.title = props?.title ?? faker.internet.domainWord();
    this.text = props?.text ?? faker.lorem.paragraph(2);
    return this;
  }

  async persist(prisma: PrismaService, userId: number) {
    return prisma.note.create({
      data: { ...(this as CreateNoteDto), userId },
    });
  }
}
