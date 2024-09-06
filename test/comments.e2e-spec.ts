import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DatabaseService } from '../src/database/database.service';

describe('CommentsController (e2e)', () => {
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
      .post('/users/register')
      .send({
        username: 'Maka1',
        password: '323232',
        email: 'maka3@email.com',
      });

    const login = await request(app.getHttpServer()).post('/auth/login').send({
      username: 'Maka1',
      password: '323232',
    });
    jwtToken = login.body.access_token;

    const post = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        title: 'post',
        description: 'description',
      });
  });

  it('should return all comments', () => {
    return request(app.getHttpServer()).get('/comments').expect(200);
  });

  it('should return comments for a post', () => {
    return request(app.getHttpServer()).get('/posts/1/comments').expect(200);
  });

  it('should return 404 if there is no post', () => {
    return request(app.getHttpServer()).get('/posts/99/comments').expect(404);
  });

  it('should create a new comment', () => {
    return request(app.getHttpServer())
      .post('/posts/1/comments')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        content: 'test comm',
      })
      .expect(201);
  });

  it('should return 404 if there is no post', () => {
    return request(app.getHttpServer())
      .post('/posts/99/comments')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(404);
  });

  it('should return a single comment', () => {
    return request(app.getHttpServer()).get('/comments/1').expect(200);
  });

  it('should return 404 if there is no comment', () => {
    return request(app.getHttpServer()).post('/comments/99').expect(404);
  });

  it('should update a comment', () => {
    return request(app.getHttpServer())
      .patch('/comments/1')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        content: 'updatedComment',
      })
      .expect(200);
  });

  it('should delete a comment', () => {
    return request(app.getHttpServer())
      .delete('/comments/1')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200);
  });

  it('should return 404 if there is no comment', () => {
    return request(app.getHttpServer())
      .delete('/comments/99')
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
