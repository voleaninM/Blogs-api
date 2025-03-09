import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);

    const register = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'Maka1',
        password: '323232',
        email: 'maka3@email.com',
      });
  });

  it('should login an existing user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'Maka1',
        password: '323232',
      })
      .expect((res) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('should return 400 if data is wrong', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'Maka2',
        password: '323232',
      })
      .expect(400);
  });

  it('should signup new user and return token', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'Maka2',
        password: '323232',
        email: 'maka3@email.com',
      })
      .expect((res) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('should return 400 if user already exists', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'Maka1',
        password: '323232',
        email: 'maka3@email.com',
      })
      .expect(400);
  });

  afterAll(async () => {
    if (databaseService) {
      await databaseService.clearDatabase();
    }
    await app.close();
  });
});
