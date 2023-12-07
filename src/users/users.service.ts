import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from "bcryptjs";
import { SignUpDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(userName: string): Promise<User> {
    // 
    return this.userModel.findOne({ userName });
  }

  async createUser(signUpDto: SignUpDto): Promise<User> {
    const { userName, email, password } = signUpDto;
    const hashedPassword = bcrypt.hashSync(password.toString(), 10);

    const user = await this.userModel.create({
      userName,
      password: hashedPassword,
      email
    });

    return user;
  }

  async updateUserLoginErrorInfo(errorInfo: string, userName: string) {
    await this.userModel.updateOne({ userName }, { $set: { passwordErrorInfo: errorInfo } });
  }
}