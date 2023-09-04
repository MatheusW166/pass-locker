import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaHelper } from './helpers/prisma.helper';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from './helpers/auth.helper';
import { WifiFactory } from './factories/wifi.factory';

describe('WifisController (e2e)', () => {
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
          .post('/wifis')
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .post('/wifis')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .post('/wifis')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 201 and create a wifi', async () => {
        const server = request(app.getHttpServer());
        const [token] = await new AuthHelper(server).generateValidToken();
        const wifi = new WifiFactory();

        const response = await server
          .post('/wifis')
          .send(wifi)
          .set('Authorization', token)
          .expect(201);

        const wifis = await prisma.wiFi.findMany({});
        expect(wifis).toHaveLength(1);
        expect(PrismaHelper.stringfyDates(wifis[0])).toEqual(response.body);
      });

      describe('Bad formatted body', () => {
        it('Should respond 400 when title is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const wifi = new WifiFactory();

          delete wifi.title;

          const response = await server
            .post('/wifis')
            .send(wifi)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'title must be a string',
              'title should not be empty',
            ]),
          );
          const wifis = await prisma.wiFi.findMany();
          expect(wifis).toHaveLength(0);
        });

        it('Should respond 400 when network is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const wifi = new WifiFactory();

          delete wifi.network;

          const response = await server
            .post('/wifis')
            .send(wifi)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'network must be a string',
              'network should not be empty',
            ]),
          );
          const wifis = await prisma.wiFi.findMany();
          expect(wifis).toHaveLength(0);
        });

        it('Should respond 400 when password is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const wifi = new WifiFactory();

          delete wifi.password;

          const response = await server
            .post('/wifis')
            .send(wifi)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'password must be a string',
              'password should not be empty',
            ]),
          );
          const wifis = await prisma.wiFi.findMany();
          expect(wifis).toHaveLength(0);
        });
      });
    });
  });

  describe('/:id (GET)', () => {
    describe('When token is invalid', () => {
      it('Should respond 401 when token is missing', async () => {
        const response = await request(app.getHttpServer())
          .get(`/wifis/1`)
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .get('/wifis/1')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .get('/wifis/1')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 200 and the user wifi', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const wifi = await new WifiFactory().persist(prisma, user.id);

        const response = await server
          .get(`/wifis/${wifi.id}`)
          .set('Authorization', token)
          .expect(200);

        expect(PrismaHelper.stringfyDates(wifi)).toEqual(response.body);
      });

      it('Should respond 404 when id does not exist', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const wifi = await new WifiFactory().persist(prisma, user.id);

        return server
          .get(`/wifis/${wifi.id + 1}`)
          .set('Authorization', token)
          .expect(404);
      });

      it('Should respond 403 when wifi is not from the given user', async () => {
        const server = request(app.getHttpServer());
        const authHelper = new AuthHelper(server);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, owner] = await authHelper.generateValidToken();
        const [anotherUserToken] = await authHelper.generateValidToken();
        const wifi = await new WifiFactory().persist(prisma, owner.id);

        return server
          .get(`/wifis/${wifi.id}`)
          .set('Authorization', anotherUserToken)
          .expect(403);
      });
    });
  });

  describe('/:id (DELETE)', () => {
    describe('When token is invalid', () => {
      it('Should respond 401 when token is missing', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/wifis/1`)
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .delete('/wifis/1')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .delete('/wifis/1')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 200 and delete the wifi', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const wifi = await new WifiFactory().persist(prisma, user.id);

        await server
          .delete(`/wifis/${wifi.id}`)
          .set('Authorization', token)
          .expect(200);

        const wifis = await prisma.wiFi.findMany();
        expect(wifis).toHaveLength(0);
      });

      it('Should respond 404 when id does not exist', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const wifi = await new WifiFactory().persist(prisma, user.id);

        return server
          .delete(`/wifis/${wifi.id + 1}`)
          .set('Authorization', token)
          .expect(404);
      });

      it('Should respond 403 when wifi is not from the given user', async () => {
        const server = request(app.getHttpServer());
        const authHelper = new AuthHelper(server);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, owner] = await authHelper.generateValidToken();
        const [anotherUserToken] = await authHelper.generateValidToken();
        const wifi = await new WifiFactory().persist(prisma, owner.id);

        return server
          .delete(`/wifis/${wifi.id}`)
          .set('Authorization', anotherUserToken)
          .expect(403);
      });
    });
  });
});
