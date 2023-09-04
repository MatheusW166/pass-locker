import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { CryptrService } from '@app/cryptr/cryptr.service';
import { Credential } from '@prisma/client';

@Injectable()
export class CredentialsService {
  constructor(
    private readonly credentialsRepository: CredentialsRepository,
    private readonly cryptr: CryptrService,
  ) {}

  async create(createCredentialDto: CreateCredentialDto, userId: number) {
    const credential = await this.credentialsRepository.findByTitleAndUserId(
      createCredentialDto.title,
      userId,
    );
    if (credential) throw new ConflictException();
    const encrypted = this.encryptCredentialFields(createCredentialDto);
    return this.credentialsRepository.create(encrypted, userId);
  }

  async findByIdOrThrow(id: number, userId: number) {
    const credential = await this.credentialsRepository.findById(id);
    if (!credential) throw new NotFoundException();
    if (credential.userId !== userId) throw new ForbiddenException();
    return this.decryptCredentialFields(credential);
  }

  async remove(id: number, userId: number) {
    await this.findByIdOrThrow(id, userId);
    return this.credentialsRepository.remove(id);
  }

  encryptCredentialFields(credential: CreateCredentialDto) {
    return {
      ...credential,
      password: this.cryptr.encrypt(credential.password),
    };
  }

  decryptCredentialFields(credential: Credential) {
    return {
      ...credential,
      password: this.cryptr.decrypt(credential.password),
    };
  }
}
