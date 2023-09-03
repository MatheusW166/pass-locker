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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/health')
  health(): string {
    return 'I’m okay!';
  }

  @Post('/erase')
  @HttpCode(HttpStatus.ACCEPTED)
  erase(@Body('password') password: string, @UserId() userId: number) {
    return this.appService.erase(userId, password);
  }
}
