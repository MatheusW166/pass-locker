import { PrismaService } from '@app/prisma/prisma.service';

export class PrismaHelper {
  constructor(private readonly prismaService: PrismaService) {}

  async clean() {
    await Promise.all([
      this.prismaService.card.deleteMany(),
      this.prismaService.wiFi.deleteMany(),
      this.prismaService.credential.deleteMany(),
      this.prismaService.note.deleteMany(),
    ]);

    await this.prismaService.user.deleteMany();
    return this;
  }

  private static isDateString(dateString: any) {
    if (typeof dateString !== 'string') return false;
    const timestamp = Date.parse(dateString);
    return !isNaN(timestamp);
  }

  static stringfyDates(props: any & { createdAt: Date; updatedAt: Date }) {
    const propsCopy = { ...props };
    for (const key in propsCopy) {
      const value = propsCopy[key];
      if (value instanceof Date) propsCopy[key] = value.toISOString();
    }
    return propsCopy;
  }

  static parseDates(props: any & { createdAt: string; updatedAt: string }) {
    const propsCopy = { ...props };
    for (const key in propsCopy) {
      const value = propsCopy[key];
      if (PrismaHelper.isDateString(value)) {
        propsCopy[key] = new Date(value);
      }
    }
    return propsCopy;
  }
}
