import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should login an existing user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'Maka2',
        password: '323232',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('should return 400 if data is wrong', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'Maka1',
        password: '323232',
      })
      .expect(400);
  });
});
