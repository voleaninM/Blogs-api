import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('TagsController (e2e)', () => {
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

    const register = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'Maka1',
        password: '323232',
        email: 'maka3@email.com',
      });

    jwtToken = register.body.access_token;
  });

  it('should create a new tag', () => {
    return request(app.getHttpServer())
      .post('/tags')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        name: 'testingTag',
      })
      .expect(201);
  });

  it('should not create a new tag if existing', () => {
    return request(app.getHttpServer())
      .post('/tags')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        name: 'testingTag',
      })
      .expect(400);
  });

  it('should delete a tag', () => {
    return request(app.getHttpServer())
      .delete('/tags/1')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200);
  });

  it('should return 404 if there is no tag', () => {
    return request(app.getHttpServer())
      .delete('/tags/99')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(404);
  });

  afterAll(async () => {
    if (databaseService) {
      await databaseService.clearDatabase();
    }
    await app.close();
  });
});
