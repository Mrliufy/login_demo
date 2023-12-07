import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from "bcryptjs"
import { maxErrorTimes, linkChar, maxMiniSeconds } from './constant';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}
  
  async signUp(signUpDto: SignUpDto): Promise<{ msg: string }> {
    const { userName, email } = signUpDto;
    const user = await this.usersService.findOne(userName);

    if (user?.userName) {
      throw new HttpException("The user is already exist!", 200);
    }

    if (user?.email === email) {
      throw new HttpException("The email is already used, please change another one!", 200);
    }

    const userInfo = await this.usersService.createUser(signUpDto)

    return { msg: `The user ${userInfo.userName} has been created succeessfully!` }
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { userName, password } = signInDto;
    const user = await this.usersService.findOne(userName);

    if (!user) {
      throw new UnauthorizedException("Invalid userName or password!");
    }

    const isLocked = await this.isUserLocked(user.passwordErrorInfo);
    if (isLocked) {
       throw new HttpException("Account is locked!", 200);
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      const isLocked = await this.updateUserPasswordErrorInfo(user.passwordErrorInfo, user.userName);
      if (isLocked) {
        throw new HttpException("Account is locked!", 200);
      }

      throw new UnauthorizedException("Invalid password!");
    }
    
    const payload = { sub: user.email, userName: user.userName };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }

  isUserLocked(passwordErrorInfo: string): boolean {
    let res = false;
    if (passwordErrorInfo) {
      const errorInfoArr = passwordErrorInfo.split(linkChar);
      const len = errorInfoArr.length

      if (Number(errorInfoArr[len - 1]) >= maxErrorTimes) {
        res = true
      }
    }

    return res;
  }

  async updateUserPasswordErrorInfo(passwordErrorInfo: string, userName: string): Promise<boolean> {
    let curErrorTimes = 1;
    const timeNow = Date.now();
    let curErrorInfoStr = "";

    if (passwordErrorInfo) {
      const errorInfoArr = passwordErrorInfo.split(linkChar);
      const len = errorInfoArr.length;

      errorInfoArr.forEach((item, idx) => {
        if (idx < len - 1) {
          if (Number(item) - timeNow < maxMiniSeconds) {
            curErrorInfoStr += `${item}${linkChar}`;
            curErrorTimes++;
          }
        }
      });
    }

    curErrorInfoStr += `${timeNow}${linkChar}${curErrorTimes}`;
    // update login error information
    await this.usersService.updateUserLoginErrorInfo(curErrorInfoStr, userName);
    const res = curErrorTimes >= maxErrorTimes;
    return res;
  }
}