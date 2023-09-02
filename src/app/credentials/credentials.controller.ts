import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UserId } from '@/decorators/auth';
import { ParamId } from '@/decorators/validation';

@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @UserId() userId: number,
  ) {
    return this.credentialsService.create(createCredentialDto, userId);
  }

  @Get(':id')
  findOne(@ParamId() id: number, @UserId() userId: number) {
    return this.credentialsService.findByIdOrThrow(id, userId);
  }

  @Delete(':id')
  remove(@ParamId() id: number, @UserId() userId: number) {
    return this.credentialsService.remove(id, userId);
  }
}
