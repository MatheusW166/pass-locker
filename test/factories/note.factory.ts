import { PrismaService } from '@app/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from '@app/notes/dto/create-note.dto';

export class NoteFactory extends PartialType(CreateNoteDto) {
  constructor() {
    super();
  }

  build(props?: Partial<CreateNoteDto>) {
    this.title = props?.title ?? faker.internet.domainWord();
    this.text = props?.text ?? faker.lorem.paragraph(2);
    return this;
  }

  async persist(prisma: PrismaService, userId: number) {
    return prisma.note.create({ data: { ...(this as CreateNoteDto), userId } });
  }
}
