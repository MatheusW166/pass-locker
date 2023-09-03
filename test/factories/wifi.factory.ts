import { PrismaService } from '@app/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { PartialType } from '@nestjs/mapped-types';
import { CreateWifiDto } from '@app/wifis/dto/create-wifi.dto';

export class WifiFactory extends PartialType(CreateWifiDto) {
  constructor() {
    super();
  }

  build(props?: Partial<CreateWifiDto>) {
    this.title = props?.title ?? faker.internet.domainWord();
    this.network = props?.network ?? faker.internet.domainName();
    this.password = props?.password ?? faker.internet.password();
    return this;
  }

  async persist(prisma: PrismaService, userId: number) {
    return prisma.wiFi.create({ data: { ...(this as CreateWifiDto), userId } });
  }
}
