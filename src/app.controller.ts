import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/route';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get('/health')
  health(): string {
    return 'I’m okay!';
  }
}
