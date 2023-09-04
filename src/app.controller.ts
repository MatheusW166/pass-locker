import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Public } from './decorators/route';
import { AppService } from './app.service';
import { UserId } from './decorators/auth';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('/')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Checks app health' })
  @ApiResponse({ status: 200, description: 'I’m okay!' })
  @Public()
  @Get('/health')
  health(): string {
    return 'I’m okay!';
  }

  @ApiBearerAuth()
  @ApiBody({ schema: { properties: { password: { type: 'string' } } } })
  @ApiOperation({ summary: 'Erase a given user' })
  @ApiResponse({ status: 202, description: 'Accepted' })
  @Post('/erase')
  @HttpCode(HttpStatus.ACCEPTED)
  erase(@Body('password') password: string, @UserId() userId: number) {
    return this.appService.erase(userId, password);
  }
}
