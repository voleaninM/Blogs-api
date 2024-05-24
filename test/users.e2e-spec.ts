import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
  });

  it('should create a new user', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        username: 'Maka1',
        password: '323232',
        email: 'maka@email.com',
      })
      .expect(201);
  });

  it('should not create a new user if existing', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        username: 'Maka1',
        password: '323232',
        email: 'maka@email.com',
      })
      .expect(400);
  });

  it('should update a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'Maka1',
        password: '323232',
      });

    jwtToken = response.body.access_token;
    return request(app.getHttpServer())
      .patch('/users/update')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        username: 'new Username',
      })
      .expect(200);
  });

  afterAll(async () => {
    if (databaseService) {
      await databaseService.clearDatabase();
    }
    await app.close();
  });
});
