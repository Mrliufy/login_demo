import { IsEmail, IsNotEmpty, IsString } from "class-validator" 

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  readonly userName: string

  @IsNotEmpty()
  @IsString()
  readonly password: string

  @IsNotEmpty()
  @IsEmail()
  readonly email: string
}