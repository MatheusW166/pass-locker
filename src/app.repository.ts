import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class AppRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async erase(userId: number) {
    await Promise.all([
      this.prismaService.credential.deleteMany({ where: { userId } }),
      this.prismaService.wiFi.deleteMany({ where: { userId } }),
      this.prismaService.note.deleteMany({ where: { userId } }),
      this.prismaService.card.deleteMany({ where: { userId } }),
    ]);
    await this.prismaService.user.delete({ where: { id: userId } });
  }
}
