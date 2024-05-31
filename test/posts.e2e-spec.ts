import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('PostsController (e2e)', () => {
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

    const signIn = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'Maka',
        password: '323232',
        email: 'maka3@email.com',
      });

    jwtToken = signIn.body.access_token;
  });

  it('should return all posts', () => {
    return request(app.getHttpServer()).get('/posts').expect(200);
  });

  it('should create a new post', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        title: 'post1',
        description: 'description',
      })
      .expect(201);
  });

  it('should return a single post', () => {
    return request(app.getHttpServer()).get('/posts/1').expect(200);
  });

  it('should return 404 if there is no post', () => {
    return request(app.getHttpServer())
      .post('/posts/99')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(404);
  });

  it('should update a post', () => {
    return request(app.getHttpServer())
      .patch('/posts/1')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        title: 'updated title',
      })
      .expect(200);
  });

  it('should delete a post', () => {
    return request(app.getHttpServer())
      .delete('/posts/1')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200);
  });

  it('should return 404 if there is no post', () => {
    return request(app.getHttpServer())
      .delete('/posts/99')
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
