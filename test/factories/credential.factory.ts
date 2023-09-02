import { PrismaService } from '@app/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCredentialDto } from '@app/credentials/dto';

export class CredentialFactory extends PartialType(CreateCredentialDto) {
  constructor() {
    super();
  }

  build(props?: Partial<CreateCredentialDto>) {
    this.title = props?.title ?? faker.internet.domainWord();
    this.url = props?.url ?? faker.internet.url();
    this.username = props?.username ?? faker.internet.userName();
    this.password = props?.password ?? faker.internet.password();

    return this;
  }

  async persist(prisma: PrismaService, userId: number) {
    return prisma.credential.create({
      data: { ...(this as CreateCredentialDto), userId },
    });
  }
}
