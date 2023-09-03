import { PrismaService } from '@app/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCredentialDto } from '@app/credentials/dto';
import Cryptr from 'cryptr';

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
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    return prisma.credential.create({
      data: {
        ...(this as CreateCredentialDto),
        password: cryptr.encrypt(this.password),
        userId,
      },
    });
  }
}
