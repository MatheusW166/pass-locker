import { SuperTest, Test } from 'supertest';
import { UserFactory } from '@test/factories/user.factory';

export class AuthHelper {
  constructor(private readonly request: SuperTest<Test>) {}

  async authenticateUser(userFactory: UserFactory) {
    return this.request.post('/auth/signin').send(userFactory.signInUser);
  }

  async generateValidToken() {
    const user = new UserFactory().buildUser();
    await this.request.post('/auth/signup').send(user);
    return this.request.post('/auth/signin').send(user.signInUser);
  }
}
