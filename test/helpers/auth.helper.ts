import { SuperTest, Test } from 'supertest';
import { UserFactory } from '@test/factories/user.factory';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { PrismaHelper } from './prisma.helper';

export class AuthHelper {
  constructor(private readonly request: SuperTest<Test>) {}

  async authenticateUser(userFactory: UserFactory) {
    const response = await this.request
      .post('/auth/signin')
      .send(userFactory.signInUser);
    return `Bearer ${response.body.token}`;
  }

  async generateValidToken(): Promise<[string, User]> {
    const user = new UserFactory().build();
    const response = await this.request.post('/auth/signup').send(user);
    const token = await this.authenticateUser(user);
    return [token, PrismaHelper.parseDates(response.body)];
  }

  static generateRandomToken(jwtService: JwtService) {
    const payload = { userId: faker.number.int({ min: 1, max: 100 }) };
    return 'Bearer ' + jwtService.sign(payload);
  }
}
