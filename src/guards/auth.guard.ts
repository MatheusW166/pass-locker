import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '@/app/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@/decorators/route';
import { UsersService } from '@app/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request);

    if (!token) throw new UnauthorizedException('No token found');

    const payload = await this.authService.verifyJwt(token);
    if (!payload) throw new UnauthorizedException('Payload invalid');

    const currentUser = await this.usersService.findById(payload.userId);
    if (!currentUser) throw new UnauthorizedException('No session found');

    request['userId'] = payload.userId;
    return true;
  }

  private extractBearerToken(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
