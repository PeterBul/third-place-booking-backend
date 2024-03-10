import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AccessTokenGuard, RolesGuard } from '../auth/guard';
import { GetUser, Roles } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { e_Roles } from 'src/auth/enum/role.enum';

@UseGuards(AccessTokenGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  @Roles(e_Roles.User)
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get()
  // @Roles(e_Roles.Admin)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch()
  @Roles(e_Roles.User, e_Roles.Admin)
  editUser(@Body() dto: EditUserDto, @GetUser('id') userId: number) {
    return this.userService.editUser(userId, dto);
  }
}
