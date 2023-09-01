import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findByIdOrThrow(id: number) {
    const user = this.usersRepository.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findByIdOrThrow(id);
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    await this.findByIdOrThrow(id);
    return this.usersRepository.remove(id);
  }
}
