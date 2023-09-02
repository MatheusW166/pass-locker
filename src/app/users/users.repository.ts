import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { PrismaService } from '@/app/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({ data: createUserDto });
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  findById(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }
}
