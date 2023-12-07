import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  const signInDto: SignInDto = {
    userName: "test",
    password: "123456"
  };
  const signUpDto: SignUpDto = {
    userName: "test",
    password: "123456",
    email: "test@163.com"
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
