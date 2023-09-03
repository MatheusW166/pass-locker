import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import Cryptr from 'cryptr';

@Injectable()
export class CredentialsService {
  constructor(private readonly credentialsRepository: CredentialsRepository) {}

  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    const credential = await this.credentialsRepository.findByTitleAndUserId(
      createCredentialDto.title,
      userId,
    );
    if (credential) throw new ConflictException();

    const { password } = createCredentialDto;
    const crypt = new Cryptr(process.env.JWT_SECRET);
    createCredentialDto.password = crypt.encrypt(password);
    return this.credentialsRepository.create(createCredentialDto, userId);
  }

  async findByIdOrThrow(id: number, userId: number) {
    const credential = await this.credentialsRepository.findById(id);
    if (!credential) throw new NotFoundException();
    if (credential.userId !== userId) throw new ForbiddenException();

    const crypt = new Cryptr(process.env.JWT_SECRET);
    return { ...credential, password: crypt.decrypt(credential.password) };
  }

  async remove(id: number, userId: number) {
    await this.findByIdOrThrow(id, userId);
    return this.credentialsRepository.remove(id);
  }
}
