import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRolesService } from 'src/user-roles/user-roles.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRolesService],
})
export class UserModule {}
