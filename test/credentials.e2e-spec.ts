import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaHelper } from './helpers/prisma.helper';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from './helpers/auth.helper';
import { CredentialFactory } from './factories/credential.factory';

describe('Credentials (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let prismaHelper: PrismaHelper;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    prisma = app.get(PrismaService);
    prismaHelper = new PrismaHelper(prisma);

    jwtService = app.get(JwtService);

    await app.init();
  });

  beforeEach(async () => {
    await prismaHelper.clean();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('/ (POST)', () => {
    describe('When token is invalid', () => {
      it('Should respond 401 when token is missing', async () => {
        const response = await request(app.getHttpServer())
          .post('/credentials')
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .post('/credentials')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .post('/credentials')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 201 and create a credential', async () => {
        const server = request(app.getHttpServer());
        const [token] = await new AuthHelper(server).generateValidToken();
        const credential = new CredentialFactory().build();

        const response = await server
          .post('/credentials')
          .send(credential)
          .set('Authorization', token)
          .expect(201);

        const credentials = await prisma.credential.findMany({});
        expect(credentials).toHaveLength(1);
        expect(prismaHelper.stringfyDates(credentials[0])).toEqual(
          response.body,
        );
      });

      it('Should respond 201 and allow two users to create the same credential', async () => {
        const server = request(app.getHttpServer());
        const authHelper = new AuthHelper(server);
        const [token1] = await authHelper.generateValidToken();
        const [token2] = await authHelper.generateValidToken();
        const credential = new CredentialFactory().build();

        await server
          .post('/credentials')
          .send(credential)
          .set('Authorization', token1)
          .expect(201);

        await server
          .post('/credentials')
          .send(credential)
          .set('Authorization', token2)
          .expect(201);

        const credentials = await prisma.credential.findMany();
        expect(credentials).toHaveLength(2);
      });

      describe('Bad formatted body', () => {
        it('Should respond 400 when title is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const credential = new CredentialFactory().build();

          delete credential.title;

          const response = await server
            .post('/credentials')
            .send(credential)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'title must be a string',
              'title should not be empty',
            ]),
          );
          const credentials = await prisma.credential.findMany();
          expect(credentials).toHaveLength(0);
        });

        it('Should respond 400 when username is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const credential = new CredentialFactory().build();

          delete credential.username;

          const response = await server
            .post('/credentials')
            .send(credential)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'username must be a string',
              'username should not be empty',
            ]),
          );
          const credentials = await prisma.credential.findMany();
          expect(credentials).toHaveLength(0);
        });

        it('Should respond 400 when url is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const credential = new CredentialFactory().build();

          delete credential.url;

          const response = await server
            .post('/credentials')
            .send(credential)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'url must be a string',
              'url should not be empty',
              'url must be a URL address',
            ]),
          );
          const credentials = await prisma.credential.findMany();
          expect(credentials).toHaveLength(0);
        });

        it('Should respond 400 when password is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const credential = new CredentialFactory().build();

          delete credential.password;

          const response = await server
            .post('/credentials')
            .send(credential)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'password must be a string',
              'password should not be empty',
            ]),
          );
          const credentials = await prisma.credential.findMany();
          expect(credentials).toHaveLength(0);
        });
      });

      describe('Right formatted body', () => {
        it('Should respond 409 when credential already exists for a given user', async () => {
          const server = request(app.getHttpServer());
          const [token, user] = await new AuthHelper(
            server,
          ).generateValidToken();
          const credential = new CredentialFactory().build();
          await credential.persist(prisma, user.id);

          await server
            .post('/credentials')
            .send(credential)
            .set('Authorization', token)
            .expect(409);

          const credentials = await prisma.credential.findMany({});
          expect(credentials).toHaveLength(1);
        });
      });
    });
  });

  describe('/:id (GET)', () => {});

  describe('/:id (DELETE)', () => {});
});
