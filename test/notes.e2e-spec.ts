import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaHelper } from './helpers/prisma.helper';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { AuthHelper } from './helpers/auth.helper';
import { NoteFactory } from './factories/note.factory';

describe('Notes (e2e)', () => {
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
          .post('/notes')
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .post('/notes')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .post('/notes')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 201 and create a note', async () => {
        const server = request(app.getHttpServer());
        const [token] = await new AuthHelper(server).generateValidToken();
        const note = new NoteFactory().build();

        const response = await server
          .post('/notes')
          .send(note)
          .set('Authorization', token)
          .expect(201);

        const notes = await prisma.note.findMany({});
        expect(notes).toHaveLength(1);
        expect(prismaHelper.stringfyDates(notes[0])).toEqual(response.body);
      });

      it('Should respond 201 and allow two users to create the same note', async () => {
        const server = request(app.getHttpServer());
        const authHelper = new AuthHelper(server);
        const [token1] = await authHelper.generateValidToken();
        const [token2] = await authHelper.generateValidToken();
        const note = new NoteFactory().build();

        await server
          .post('/notes')
          .send(note)
          .set('Authorization', token1)
          .expect(201);

        await server
          .post('/notes')
          .send(note)
          .set('Authorization', token2)
          .expect(201);

        const notes = await prisma.note.findMany();
        expect(notes).toHaveLength(2);
      });

      describe('Bad formatted body', () => {
        it('Should respond 400 when title is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const note = new NoteFactory().build();

          delete note.title;

          const response = await server
            .post('/notes')
            .send(note)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'title must be a string',
              'title should not be empty',
            ]),
          );
          const notes = await prisma.note.findMany();
          expect(notes).toHaveLength(0);
        });

        it('Should respond 400 when text is missing', async () => {
          const server = request(app.getHttpServer());
          const [token] = await new AuthHelper(server).generateValidToken();
          const note = new NoteFactory().build();

          delete note.text;

          const response = await server
            .post('/notes')
            .send(note)
            .set('Authorization', token)
            .expect(400);

          expect(response.body.message).toEqual(
            expect.arrayContaining([
              'text must be a string',
              'text should not be empty',
            ]),
          );
          const notes = await prisma.note.findMany();
          expect(notes).toHaveLength(0);
        });
      });

      describe('Right formatted body', () => {
        it('Should respond 409 when note already exists for a given user', async () => {
          const server = request(app.getHttpServer());
          const [token, user] = await new AuthHelper(
            server,
          ).generateValidToken();
          const note = new NoteFactory().build();
          await note.persist(prisma, user.id);

          await server
            .post('/notes')
            .send(note)
            .set('Authorization', token)
            .expect(409);

          const notes = await prisma.note.findMany({});
          expect(notes).toHaveLength(1);
        });
      });
    });
  });

  describe('/:id (GET)', () => {
    describe('When token is invalid', () => {
      it('Should respond 401 when token is missing', async () => {
        const response = await request(app.getHttpServer())
          .get(`/notes/1`)
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .get('/notes/1')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .get('/notes/1')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 200 and the user note', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const note = await new NoteFactory().build().persist(prisma, user.id);

        const response = await server
          .get(`/notes/${note.id}`)
          .set('Authorization', token)
          .expect(200);

        expect(prismaHelper.stringfyDates(note)).toEqual(response.body);
      });

      it('Should respond 404 when id does not exist', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const note = await new NoteFactory().build().persist(prisma, user.id);

        return server
          .get(`/notes/${note.id + 1}`)
          .set('Authorization', token)
          .expect(404);
      });

      it('Should respond 403 when note is not from the given user', async () => {
        const server = request(app.getHttpServer());
        const authHelper = new AuthHelper(server);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, owner] = await authHelper.generateValidToken();
        const [anotherUserToken] = await authHelper.generateValidToken();
        const note = await new NoteFactory().build().persist(prisma, owner.id);

        return server
          .get(`/notes/${note.id}`)
          .set('Authorization', anotherUserToken)
          .expect(403);
      });
    });
  });

  describe('/:id (DELETE)', () => {
    describe('When token is invalid', () => {
      it('Should respond 401 when token is missing', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/notes/1`)
          .expect(401);

        expect(response.body.message).toEqual('No token found');
      });

      it('Should respond 401 when token is invalid', async () => {
        const invalidToken = faker.string.alpha({
          length: { min: 60, max: 200 },
        });
        const response = await request(app.getHttpServer())
          .delete('/notes/1')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.message).toEqual('Invalid token');
      });

      it('Should respond 401 when there is no user for the given token', async () => {
        const token = AuthHelper.generateRandomToken(jwtService);
        const response = await request(app.getHttpServer())
          .delete('/notes/1')
          .set('Authorization', token)
          .expect(401);

        expect(response.body.message).toEqual('No session found');
      });
    });

    describe('When token is valid', () => {
      it('Should respond 200 and delete the note', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const note = await new NoteFactory().build().persist(prisma, user.id);

        await server
          .delete(`/notes/${note.id}`)
          .set('Authorization', token)
          .expect(200);

        const notes = await prisma.note.findMany();
        expect(notes).toHaveLength(0);
      });

      it('Should respond 404 when id does not exist', async () => {
        const server = request(app.getHttpServer());
        const [token, user] = await new AuthHelper(server).generateValidToken();
        const note = await new NoteFactory().build().persist(prisma, user.id);

        return server
          .delete(`/notes/${note.id + 1}`)
          .set('Authorization', token)
          .expect(404);
      });

      it('Should respond 403 when note is not from the given user', async () => {
        const server = request(app.getHttpServer());
        const authHelper = new AuthHelper(server);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, owner] = await authHelper.generateValidToken();
        const [anotherUserToken] = await authHelper.generateValidToken();
        const note = await new NoteFactory().build().persist(prisma, owner.id);

        return server
          .delete(`/notes/${note.id}`)
          .set('Authorization', anotherUserToken)
          .expect(403);
      });
    });
  });
});
