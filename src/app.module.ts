import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017"),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
