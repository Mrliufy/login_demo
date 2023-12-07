import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type UsersDocument = User & Document

@Schema()
export class User {
  @Prop()
  email: string

  @Prop()
  userName: string

  @Prop()
  password: string

  @Prop()
  passwordErrorInfo: string
}

export const UsersSchema = SchemaFactory.createForClass(User)