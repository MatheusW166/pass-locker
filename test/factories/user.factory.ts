import { PrismaService } from '@app/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from '@app/users/dto';
import { SignInDto } from '@app/auth/dto';
import bcrypt from 'bcrypt';
import { IFactory } from './ifactory.factory';
import { User } from '@prisma/client';

export class UserFactory
  extends CreateUserDto
  implements IFactory<CreateUserDto, User>
{
  constructor() {
    super();
    this.build();
  }

  build(props?: Partial<CreateUserDto>) {
    this.name = props?.name ?? faker.person.fullName();
    this.email = props?.email ?? faker.internet.email();
    this.password = props?.password ?? this.generateStrongPassword();
    return this;
  }

  get signInUser(): SignInDto {
    return {
      email: this.email,
      password: this.password,
    };
  }

  async persist(prisma: PrismaService) {
    return prisma.user.create({
      data: {
        ...(this as CreateUserDto),
        password: bcrypt.hashSync(this.password, 10),
      },
    });
  }

  generateStrongPassword() {
    return faker.internet.password({ length: 10 }) + 'Aa0!';
  }
}
