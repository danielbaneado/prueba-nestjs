import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { UserDao } from './dao/user.dao.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserDao, UserService],
  controllers: [UserController],
  exports: [UserService, UserDao],
})
export class UserModule {}
