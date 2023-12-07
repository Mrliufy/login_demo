import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, INestApplication, UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("auth controller:", () => {
    describe("signin", () => {
      it("should sign succeed", () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({ userName: "Jerry", password: "123456" })
          .expect(200);
      });

      it("should throw UnauthorizedException", (done) => {
        try {
          const res = request(app.getHttpServer())
            .post('/auth/signin')
            .send({ userName: "jerry", password: "123456" })
          done()
        } catch (error) {
          expect(error).toBeInstanceOf(UnauthorizedException);
        }
      });

      it("should throw HttpException", (done) => {
        try {
          const res = request(app.getHttpServer())
            .post('/auth/signin')
            .send({ userName: "test", password: "123456" })
          done()
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
        }
      });
    });

    describe("signup", () => {
      it("should register user succeessfully", () => {
        const userName = Date.now() + "";
        const email = userName + "@163.com";
        const password = "123456";
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send({ userName, password, email })
          .expect(200);
      });

      it("should throw HttpException", (done) => {
        try {
          const res = request(app.getHttpServer())
            .post('/auth/signup')
            .send({ userName: "test", password: "123456", email: "test@163.com" })
          done()
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
        }
      });
    });

  });
});
