import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '@/app/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  exports: [UsersService],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
