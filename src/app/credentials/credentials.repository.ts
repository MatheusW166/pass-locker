import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class CredentialsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createCredentialDto: CreateCredentialDto, userId: number) {
    return this.prismaService.credential.create({
      data: { ...createCredentialDto, userId },
    });
  }

  findByTitleAndUserId(title: string, userId: number) {
    return this.prismaService.credential.findUnique({
      where: { title_userId: { title, userId } },
    });
  }

  findById(id: number) {
    return this.prismaService.credential.findUnique({
      where: { id },
    });
  }

  remove(id: number) {
    return this.prismaService.credential.delete({ where: { id } });
  }
}
