import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWifiDto } from './dto/create-wifi.dto';
import { WifisRepository } from './wifis.repository';

@Injectable()
export class WifisService {
  constructor(private readonly wifisRepository: WifisRepository) {}

  async create(createWifiDto: CreateWifiDto, userId: number) {
    return this.wifisRepository.create(createWifiDto, userId);
  }

  async findByIdOrThrow(id: number, userId: number) {
    const note = await this.wifisRepository.findById(id);
    if (!note) throw new NotFoundException();
    if (note.userId !== userId) throw new ForbiddenException();
    return note;
  }

  async remove(id: number, userId: number) {
    await this.findByIdOrThrow(id, userId);
    return this.wifisRepository.remove(id);
  }
}
