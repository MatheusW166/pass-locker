import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaHelper } from './helpers/prisma.helper';
import { UserFactory } from './factories/user.factory';
import { faker } from '@faker-js/faker';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let prismaHelper: PrismaHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    prisma = app.get(PrismaService);
    prismaHelper = new PrismaHelper(prisma);

    await app.init();
  });

  beforeEach(async () => {
    await prismaHelper.clean();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('/signup (POST)', () => {
    it('Should create an user and respond 201', async () => {
      const userFactory = new UserFactory();
      const createUserDto = userFactory;

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(createUserDto)
        .expect(201);

      const users = await prisma.user.findMany();
      expect(users).toHaveLength(1);

      const user = PrismaHelper.stringfyDates(users[0]);
      delete user.password;

      expect(user).toEqual(response.body);
    });

    describe('Bad formatted body', () => {
      it('Should respond 400 when name is missing', async () => {
        const userWrongFormated = new UserFactory();
        delete userWrongFormated.name;

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(userWrongFormated)
          .expect(400);

        expect(response.body.message).toEqual(
          expect.arrayContaining([
            'name must be a string',
            'name should not be empty',
          ]),
        );
        const users = await prisma.user.findMany();
        expect(users).toHaveLength(0);
      });

      it('Should respond 400 when email is missing', async () => {
        const userWrongFormated = new UserFactory();
        delete userWrongFormated.email;

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(userWrongFormated)
          .expect(400);

        expect(response.body.message).toEqual(
          expect.arrayContaining([
            'email must be a string',
            'email should not be empty',
          ]),
        );
        const users = await prisma.user.findMany();
        expect(users).toHaveLength(0);
      });

      it('Should respond 400 when password is missing', async () => {
        const userWrongFormated = new UserFactory();
        delete userWrongFormated.password;

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(userWrongFormated)
          .expect(400);

        expect(response.body.message).toEqual(
          expect.arrayContaining([
            'password must be a string',
            'password should not be empty',
          ]),
        );
        const users = await prisma.user.findMany();
        expect(users).toHaveLength(0);
      });
    });

    describe('Right formatted body', () => {
      it('Should respond 400 when email is invalid', async () => {
        const userInvalidEmail = new UserFactory();
        userInvalidEmail.email = userInvalidEmail.email.split('@')[0];

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(userInvalidEmail)
          .expect(400);

        expect(response.body.message).toEqual(['email must be an email']);
        const users = await prisma.user.findMany();
        expect(users).toHaveLength(0);
      });

      it('Should respond 400 when password is weak', async () => {
        const userWeakPassword = new UserFactory();
        userWeakPassword.password = faker.internet.password({ length: 9 });

        const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(userWeakPassword)
          .expect(400);

        expect(response.body.message).toEqual([
          'password is not strong enough',
        ]);
        const users = await prisma.user.findMany();
        expect(users).toHaveLength(0);
      });

      it('Should respond 409 when user already exists', async () => {
        const user = new UserFactory();
        await user.persist(prisma);

        await request(app.getHttpServer())
          .post('/auth/signup')
          .send(user)
          .expect(409);

        const users = await prisma.user.findMany();
        expect(users).toHaveLength(1);
      });
    });
  });

  describe('/signin (POST)', () => {
    it('Should respond with the jwt token and status 200', async () => {
      const user = new UserFactory();
      const server = request(app.getHttpServer());
      await server.post('/auth/signup').send(user);

      const response = await server
        .post('/auth/signin')
        .send(user.signInUser)
        .expect(200);

      expect(response.body).toEqual({ token: expect.any(String) });
    });

    describe('Bad formatted body', () => {
      it('Should respond 400 when email is missing', async () => {
        const userWrongFormated = new UserFactory();
        delete userWrongFormated.email;

        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send(userWrongFormated.signInUser)
          .expect(400);

        expect(response.body.message).toEqual(
          expect.arrayContaining([
            'email must be a string',
            'email should not be empty',
          ]),
        );
      });

      it('Should respond 400 when password is missing', async () => {
        const userWrongFormated = new UserFactory();
        delete userWrongFormated.password;

        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send(userWrongFormated.signInUser)
          .expect(400);

        expect(response.body.message).toEqual(
          expect.arrayContaining([
            'password must be a string',
            'password should not be empty',
          ]),
        );
      });
    });

    describe('Right formatted body', () => {
      it('Should respond 400 when email is invalid', async () => {
        const userInvalidEmail = new UserFactory();
        userInvalidEmail.email = userInvalidEmail.email.split('@')[0];

        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send(userInvalidEmail.signInUser)
          .expect(400);

        expect(response.body.message).toEqual(['email must be an email']);
      });

      it('Should respond 400 when password is weak', async () => {
        const userWeakPassword = new UserFactory();
        userWeakPassword.password = faker.internet.password({ length: 9 });

        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send(userWeakPassword.signInUser)
          .expect(400);

        expect(response.body.message).toEqual([
          'password is not strong enough',
        ]);
      });

      it('Should respond 401 when password is wrong', async () => {
        const user = new UserFactory();
        const server = request(app.getHttpServer());
        await server.post('/auth/signup').send(user);

        const userWrongPassword = {
          ...user.signInUser,
          password: user.generateStrongPassword(),
        };

        const response = await server
          .post('/auth/signin')
          .send(userWrongPassword)
          .expect(401);

        expect(response.body).not.toContain({ token: expect.any(String) });
      });
    });
  });
});
