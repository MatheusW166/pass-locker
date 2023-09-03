import { Injectable } from '@nestjs/common';
import { CreateWifiDto } from './dto/create-wifi.dto';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class WifisRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createWifiDto: CreateWifiDto, userId: number) {
    return this.prisma.wiFi.create({ data: { ...createWifiDto, userId } });
  }

  findById(id: number) {
    return this.prisma.wiFi.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.wiFi.delete({ where: { id } });
  }
}
