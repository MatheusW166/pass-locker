import { Injectable } from '@nestjs/common';
import { UsersService } from './app/users/users.service';
import { AuthService } from './app/auth/auth.service';
import { AppRepository } from './app.repository';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly appRepository: AppRepository,
  ) {}

  async erase(userId: number, password: string) {
    const user = await this.userService.findByIdOrThrow(userId);
    this.authService.comparePasswordsOrThrow(password, user.password);
    return this.appRepository.erase(userId);
  }
}
