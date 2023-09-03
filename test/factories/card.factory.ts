import { PrismaService } from '@app/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { PartialType } from '@nestjs/mapped-types';
import Cryptr from 'cryptr';
import { CreateCardDto } from '@app/cards/dto/create-card.dto';
import { CardType } from '@prisma/client';

export class CardFactory extends PartialType(CreateCardDto) {
  constructor() {
    super();
  }

  build(props?: Partial<CreateCardDto>) {
    this.title = props?.title ?? faker.internet.domainWord();
    this.displayName = props?.displayName ?? faker.person.fullName();
    this.code =
      props?.number ?? faker.number.int({ min: 100, max: 999 }).toString();
    this.expDate = props?.expDate ?? faker.date.future();
    this.isVirtual = props?.isVirtual ?? faker.datatype.boolean();
    this.type = props?.type ?? faker.helpers.enumValue(CardType);
    this.number = props?.number ?? faker.string.numeric(16);
    return this;
  }

  async persist(prisma: PrismaService, userId: number) {
    const cryptr = new Cryptr(process.env.JWT_SECRET);
    return prisma.card.create({
      data: {
        ...(this as CreateCardDto),
        code: cryptr.encrypt(this.code),
        number: cryptr.encrypt(this.number),
        userId,
      },
    });
  }
}
