import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { AuthHelper } from './helpers/auth.helper';
import { CredentialFactory } from './factories/credential.factory';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaHelper } from './helpers/prisma.helper';
import { CardFactory } from './factories/card.factory';
import { NoteFactory } from './factories/note.factory';
import { UserFactory } from './factories/user.factory';
import { faker } from '@faker-js/faker';
import { WifiFactory } from './factories/wifi.factory';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let prismaHelper: PrismaHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('I’m okay!');
  });

  describe('/erase (POST)', () => {
    it('Should respond 202 and delete all user data', async () => {
      const server = request(app.getHttpServer());

      const user = new UserFactory();
      const persistedUser = await user.persist(prisma);
      const token = await new AuthHelper(server).authenticateUser(user);

      await new CredentialFactory().persist(prisma, persistedUser.id);
      await new CardFactory().persist(prisma, persistedUser.id);
      await new NoteFactory().persist(prisma, persistedUser.id);
      await new WifiFactory().persist(prisma, persistedUser.id);

      await server
        .post('/erase')
        .send({ password: user.password })
        .set('Authorization', token)
        .expect(202);

      const credentials = await prisma.credential.findMany();
      const cards = await prisma.card.findMany();
      const notes = await prisma.note.findMany();
      const wifis = await prisma.wiFi.findMany();
      const users = await prisma.user.findMany();

      expect(credentials).toHaveLength(0);
      expect(cards).toHaveLength(0);
      expect(notes).toHaveLength(0);
      expect(users).toHaveLength(0);
      expect(wifis).toHaveLength(0);
    });

    it('Should respond 401 if password is wrong', async () => {
      const server = request(app.getHttpServer());

      const user = new UserFactory();
      const persistedUser = await user.persist(prisma);
      const token = await new AuthHelper(server).authenticateUser(user);

      await new CredentialFactory().persist(prisma, persistedUser.id);
      await new CardFactory().persist(prisma, persistedUser.id);
      await new NoteFactory().persist(prisma, persistedUser.id);
      await new WifiFactory().persist(prisma, persistedUser.id);

      await server
        .post('/erase')
        .send({ password: faker.string.alphanumeric(10) })
        .set('Authorization', token)
        .expect(401);

      const credentials = await prisma.credential.findMany();
      const cards = await prisma.card.findMany();
      const notes = await prisma.note.findMany();
      const users = await prisma.user.findMany();
      const wifis = await prisma.wiFi.findMany();

      expect(credentials).toHaveLength(1);
      expect(cards).toHaveLength(1);
      expect(notes).toHaveLength(1);
      expect(users).toHaveLength(1);
      expect(wifis).toHaveLength(1);
    });
  });
});
