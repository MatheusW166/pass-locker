import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaHelper } from './helpers/prisma.helper';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from './helpers/auth.helper';
import { CardFactory } from './factories/card.factory';

describe('Cards (e2e)', () => {
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
          .post('/cards')
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .post('/cards')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .post('/cards')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 201 and create a card', async () => {
        const server = request(app.getHttpServer());
        const [token] = await new AuthHelper(server).generateValidToken();
        const card = new CardFactory().build();

        const response = await server
          .post('/cards')
          .send(card)
          .set('Authorization', token)
          .expect(201);

        const cards = await prisma.card.findMany({});
        expect(cards).toHaveLength(1);
        expect(prismaHelper.stringfyDates(cards[0])).toEqual({
          ...response.body,
          expDate: expect.any(Date),
        });
      });

      it('Should respond 201 and allow two users to create the same card', async () => {
        const server = request(app.getHttpServer());
        const authHelper = new AuthHelper(server);
        const [token1] = await authHelper.generateValidToken();
        const [token2] = await authHelper.generateValidToken();
        const card = new CardFactory().build();

        await server
          .post('/cards')
          .send(card)
          .set('Authorization', token1)
          .expect(201);

        await server
          .post('/cards')
          .send(card)
          .set('Authorization', token2)
          .expect(201);

        const cards = await prisma.card.findMany();
        expect(cards).toHaveLength(2);
      });

      describe('Bad formatted body', () => {
        it('Should respond 400 when title is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const card = new CardFactory().build();

          delete card.title;

          const response = await server
            .post('/cards')
            .send(card)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'title must be a string',
              'title should not be empty',
            ]),
          );
          const cards = await prisma.card.findMany();
          expect(cards).toHaveLength(0);
        });

        it('Should respond 400 when displayName is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const card = new CardFactory().build();

          delete card.displayName;

          const response = await server
            .post('/cards')
            .send(card)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'displayName must be a string',
              'displayName should not be empty',
            ]),
          );
          const cards = await prisma.card.findMany();
          expect(cards).toHaveLength(0);
        });

        it('Should respond 400 when code is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const card = new CardFactory().build();

          delete card.code;

          const response = await server
            .post('/cards')
            .send(card)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'code must be a string',
              'code should not be empty',
            ]),
          );
          const cards = await prisma.card.findMany();
          expect(cards).toHaveLength(0);
        });

        it('Should respond 400 when number is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const card = new CardFactory().build();

          delete card.number;

          const response = await server
            .post('/cards')
            .send(card)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'number must be a string',
              'number should not be empty',
            ]),
          );
          const cards = await prisma.card.findMany();
          expect(cards).toHaveLength(0);
        });

        it('Should respond 400 when expDate is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const card = new CardFactory().build();

          delete card.expDate;

          const response = await server
            .post('/cards')
            .send(card)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'expDate must be a valid ISO 8601 date string',
            ]),
          );
          const cards = await prisma.card.findMany();
          expect(cards).toHaveLength(0);
        });

        it('Should respond 400 when isVirtual is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const card = new CardFactory().build();

          delete card.isVirtual;

          const response = await server
            .post('/cards')
            .send(card)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining(['isVirtual must be a boolean value']),
          );
          const cards = await prisma.card.findMany();
          expect(cards).toHaveLength(0);
        });

        it('Should respond 400 when type is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const card = new CardFactory().build();

          delete card.type;

          const response = await server
            .post('/cards')
            .send(card)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'type must be one of the following values: CREDIT, DEBIT, BOTH',
            ]),
          );
          const cards = await prisma.card.findMany();
          expect(cards).toHaveLength(0);
        });
      });

      describe('Right formatted body', () => {
        it('Should respond 409 when card already exists for a given user', async () => {
          const server = request(app.getHttpServer());
          const [token, user] = await new AuthHelper(
            server,
          ).generateValidToken();
          const card = new CardFactory().build();
          await card.persist(prisma, user.id);

          await server
            .post('/cards')
            .send(card)
            .set('Authorization', token)
            .expect(409);

          const cards = await prisma.card.findMany({});
          expect(cards).toHaveLength(1);
        });
      });
    });
  });

  describe('/:id (GET)', () => {
    describe('When token is invalid', () => {
      it('Should respond 401 when token is missing', async () => {
        const response = await request(app.getHttpServer())
          .get(`/cards/1`)
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .get('/cards/1')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .get('/cards/1')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 200 and the user card', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const card = await new CardFactory().build().persist(prisma, user.id);

        const response = await server
          .get(`/cards/${card.id}`)
          .set('Authorization', token)
          .expect(200);

        expect(prismaHelper.stringfyDates(card)).toEqual({
          ...response.body,
          expDate: expect.any(Date),
          code: expect.any(String),
          number: expect.any(String),
        });
      });

      it('Should respond 404 when id does not exist', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const card = await new CardFactory().build().persist(prisma, user.id);

        return server
          .get(`/cards/${card.id + 1}`)
          .set('Authorization', token)
          .expect(404);
      });

      it('Should respond 403 when card is not from the given user', async () => {
        const server = request(app.getHttpServer());
        const authHelper = new AuthHelper(server);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, owner] = await authHelper.generateValidToken();
        const [anotherUserToken] = await authHelper.generateValidToken();
        const card = await new CardFactory().build().persist(prisma, owner.id);

        return server
          .get(`/cards/${card.id}`)
          .set('Authorization', anotherUserToken)
          .expect(403);
      });
    });
  });

  describe('/:id (DELETE)', () => {
    describe('When token is invalid', () => {
      it('Should respond 401 when token is missing', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/cards/1`)
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .delete('/cards/1')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .delete('/cards/1')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 200 and delete the card', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const card = await new CardFactory().build().persist(prisma, user.id);

        await server
          .delete(`/cards/${card.id}`)
          .set('Authorization', token)
          .expect(200);

        const cards = await prisma.card.findMany();
        expect(cards).toHaveLength(0);
      });

      it('Should respond 404 when id does not exist', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const card = await new CardFactory().build().persist(prisma, user.id);

        return server
          .delete(`/cards/${card.id + 1}`)
          .set('Authorization', token)
          .expect(404);
      });

      it('Should respond 403 when card is not from the given user', async () => {
        const server = request(app.getHttpServer());
        const authHelper = new AuthHelper(server);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, owner] = await authHelper.generateValidToken();
        const [anotherUserToken] = await authHelper.generateValidToken();
        const card = await new CardFactory().build().persist(prisma, owner.id);

        return server
          .delete(`/cards/${card.id}`)
          .set('Authorization', anotherUserToken)
          .expect(403);
      });
    });
  });
});
