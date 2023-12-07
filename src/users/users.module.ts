import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UsersSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{
    name: User.name, schema: UsersSchema
  }])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}