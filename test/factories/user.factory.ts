import { PrismaService } from '@app/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from '@app/users/dto';
import { PartialType } from '@nestjs/mapped-types';
import { SignInDto } from '@app/auth/dto';

export class UserFactory extends PartialType(CreateUserDto) {
  constructor() {
    super();
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
    return prisma.user.create({ data: this as CreateUserDto });
  }

  generateStrongPassword() {
    return faker.internet.password({ length: 10 }) + 'Aa0!';
  }
}
