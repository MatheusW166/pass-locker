import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UserId } from '@/decorators/auth';
import { ParamId } from '@/decorators/validation';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @ApiOperation({ summary: 'Creates a credential' })
  @ApiResponse({
    status: 201,
    description: 'Created credential',
  })
  @Post()
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @UserId() userId: number,
  ) {
    return this.credentialsService.create(createCredentialDto, userId);
  }

  @ApiOperation({ summary: 'Retrieves a credential' })
  @ApiResponse({
    status: 200,
    description: 'Credential that matches the given id',
  })
  @Get(':id')
  findOne(@ParamId() id: number, @UserId() userId: number) {
    return this.credentialsService.findByIdOrThrow(id, userId);
  }

  @ApiOperation({ summary: 'Deletes a credential' })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@ParamId() id: number, @UserId() userId: number) {
    return this.credentialsService.remove(id, userId);
  }
}
