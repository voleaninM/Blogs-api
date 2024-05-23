import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UsersController (e2e)', () => {
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
      });

    jwtToken = response.body.access_token;
  });

  it('should create a new user', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        username: 'Maka5',
        password: '323232',
        email: 'maka3@email.com',
      })
      .expect(201);
  });

  it('should not create a new user if existing', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        username: 'Maka3',
        password: '323232',
        email: 'maka@email.com',
      })
      .expect(400);
  });

  it('should update a user', () => {
    return request(app.getHttpServer())
      .patch('/users/update')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        username: 'new Username',
      })
      .expect(200);
  });
});
