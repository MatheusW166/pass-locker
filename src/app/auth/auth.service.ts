import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;
    const userFound = await this.usersService.findByEmail(email);

    if (userFound) throw new ConflictException();

    const hashedPass = bcrypt.hashSync(password, 10);
    const user = await this.usersService.create({
      ...signUpDto,
      password: hashedPass,
    });

    delete user.password;
    return user;
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { userId: user.id };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }

  async verifyJwt(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (_) {
      throw new UnauthorizedException();
    }
  }
}
