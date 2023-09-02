import { PrismaService } from '@app/prisma/prisma.service';

export class PrismaHelper {
  constructor(private readonly prismaService: PrismaService) {}

  async clean() {
    await Promise.all([
      this.prismaService.card.deleteMany(),
      this.prismaService.license.deleteMany(),
      this.prismaService.wiFi.deleteMany(),
      this.prismaService.credential.deleteMany(),
      this.prismaService.note.deleteMany(),
    ]);

    await this.prismaService.user.deleteMany();
    return this;
  }

  stringfyDates(props: any & { createdAt: Date; updatedAt: Date }) {
    return {
      ...props,
      createdAt: props.createdAt.toISOString(),
      updatedAt: props.updatedAt.toISOString(),
    };
  }
}
