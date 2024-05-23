import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('PostsController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'Maka2',
        password: '323232',
      })
      .expect(201);

    jwtToken = response.body.access_token;
  });

  it('should return all posts', () => {
    return request(app.getHttpServer()).get('/posts').expect(200);
  });

  it('should create a new post', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        title: 'post3',
        description: 'description3',
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

  it('should return 403 if you are not and owner of the post', () => {
    return request(app.getHttpServer())
      .patch('/posts/5')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        title: 'updated title',
      })
      .expect(403);
  });

  it('should delete a post', () => {
    return request(app.getHttpServer())
      .delete('/posts/2')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200);
  });

  it('should return 404 if there is no comment', () => {
    return request(app.getHttpServer())
      .delete('/posts/99')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(404);
  });
});
