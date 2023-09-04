import { PrismaService } from '@app/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { CreateWifiDto } from '@app/wifis/dto/create-wifi.dto';
import { IFactory } from './ifactory.factory';
import { WiFi } from '@prisma/client';

export class WifiFactory
  extends CreateWifiDto
  implements IFactory<CreateWifiDto, WiFi>
{
  constructor() {
    super();
    this.build();
  }

  build(props?: Partial<CreateWifiDto>) {
    this.title = props?.title ?? faker.internet.domainWord();
    this.network = props?.network ?? faker.internet.domainName();
    this.password = props?.password ?? faker.internet.password();
    return this;
  }

  async persist(prisma: PrismaService, userId: number) {
    return prisma.wiFi.create({
      data: { ...(this as CreateWifiDto), userId },
    });
  }
}
