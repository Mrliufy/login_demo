import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signInDto: SignUpDto): Promise<{ msg: string }> {
    return this.authService.signUp(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: SignInDto): Promise<{access_token: string}> {
    try {
      return this.authService.signIn(signInDto);
    } catch (err) {
      
    }
  }
}