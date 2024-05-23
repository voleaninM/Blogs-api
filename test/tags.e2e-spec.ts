import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TagsController (e2e)', () => {
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
        username: 'Maka',
        password: '323232',
      })
      .expect(201);

    jwtToken = response.body.access_token;
  });

  it('should create a new tag', () => {
    return request(app.getHttpServer())
      .post('/tags')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        name: 'testingTag5',
      })
      .expect(201);
  });

  it('should not create a new tag if existing', () => {
    return request(app.getHttpServer())
      .post('/tags')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({
        name: 'testingTag4',
      })
      .expect(400);
  });

  it('should delete a tag', () => {
    return request(app.getHttpServer())
      .delete('/tags/13')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200);
  });

  it('should return 404 if there is no tag', () => {
    return request(app.getHttpServer())
      .delete('/tags/99')
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(404);
  });
});
