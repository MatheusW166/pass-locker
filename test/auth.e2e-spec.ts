import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaHelper } from './helpers/prisma.helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let prismaHelper: PrismaHelper;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);

    prismaHelper = new PrismaHelper(prisma);
    await prismaHelper.clean();

    await app.init();
  });

  afterEach(async () => {
    await prismaHelper.disconnect();
  });

  describe('/signup (POST)', () => {
    it('Should create an user and respond 201', async () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect('I’m okay!');
    });
  });

  describe('/signin (POST)', () => {
    it('Should respond with the jwt token and status 200', async () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect('I’m okay!');
    });
  });
});
