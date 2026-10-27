import { Module } from '@nestjs/common';
import { UserDao } from './dao/user.dao.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';

@Module({
  providers: [UserDao, UserService],
  controllers: [UserController],
  exports: [UserService, UserDao],
})
export class UserModule {}
