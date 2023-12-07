import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from "bcryptjs"
import { HttpException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const signInEmptyDto: SignInDto = {
    userName: "test1",
    password: "123456"
  };
  const signInDto: SignInDto = {
    userName: "test",
    password: "123456"
  };
  const signInErrorDto: SignInDto = {
    userName: "test",
    password: "1234567"
  };
  const signUpDto: SignUpDto = {
    userName: "test",
    password: "123456",
    email: "test@163.com"
  };
  const userInfo: User = {
    passwordErrorInfo: "",
    userName: "test",
    password: "$2a$10$OTgwLgdN1rpvdYlEdG2NIOsOYQHNTbc/uIGzd4dGQuS2jfnLqb33W",
    email: "test@163.com"
  };

  const userInfoLocked: User = {
    passwordErrorInfo: "1200&12000&12&3",
    userName: "testLocked",
    password: "123456",
    email: "test@163.com"
  };

  const map = {
    test: userInfo,
    testLocked: userInfoLocked,
    test1: null
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockImplementation(() => "token")
          }
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockImplementation((userName) => {
              return map[userName]
            }),
            createUser: jest.fn(),
            updateUserLoginErrorInfo: jest.fn(),
            exec: jest.fn(),
          }
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("isUserLocked", () => {
    it("should return true", () => {
      const str = "1232&123&12&3";

      expect(service.isUserLocked(str)).toBe(true);
    });
    it("should return false", () => {
      const str = "1232&123&2";

      expect(service.isUserLocked(str)).toBe(false);
    });
    it("should return false", () => {
      const str = "";

      expect(service.isUserLocked(str)).toBe(false);
    });
  });

  describe("updateUserPasswordErrorInfo", () => {
    it("should return true", async () => {
      const errorInfo = `${Date.now()}&${Date.now()}&2`;
      const userName = "test";

      expect(await service.updateUserPasswordErrorInfo(errorInfo, userName)).toEqual(true);
    });

    it("should return false", async () => {
      const errorInfo = `${Date.now()}&1`;
      const userName = "test";

      expect(await service.updateUserPasswordErrorInfo(errorInfo, userName)).toEqual(false);
    });

    it("should return false", async () => {
      const time = Date.now() + 5 * 60 * 1000;
      const errorInfo = `${time}&${Date.now()}&2`;
      const userName = "test";

      expect(await service.updateUserPasswordErrorInfo(errorInfo, userName)).toEqual(false);
    });
  });


  describe("signIn", () => {
    it("should throw UnauthorizedException exception", async () => {
      try {
        await service.signIn(signInEmptyDto)
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException)
      }
    });

    it("should throw HttpException exception", async () => {
      try {
        await service.signIn(userInfoLocked)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
      }
    });

    it("should throw HttpException exception", async () => {
      try {
        await service.signIn(userInfoLocked);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });

    it("should throw UnauthorizedException exception", async () => {
      try {
        await service.signIn(signInErrorDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException)
      }
    });

     it("should throw HttpException exception", async () => {
       try {
        const data: User = {
          passwordErrorInfo: "1200&12000&2",
          userName: "testLocked",
          password: "123456",
          email: "test@163.com"
        };
         await service.signIn(data);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
      }
     })
    
    it("should return ", async () => {

      expect(await service.signIn(signInDto)).toEqual({ "access_token": "token"});
    });
  })
});
