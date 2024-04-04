import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard, RolesGuard } from '../auth/guard';
import { GetUser, Roles } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { e_Roles } from 'src/auth/enum/role.enum';
import { UserRolesService } from 'src/user-roles/user-roles.service';

@UseGuards(AccessTokenGuard, RolesGuard)
@Roles(e_Roles.Member, e_Roles.Admin)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userRolesService: UserRolesService,
  ) {}
  @Get('me')
  @Roles(e_Roles.User)
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Patch()
  @Roles(e_Roles.Admin)
  editMe(@Body() dto: EditUserDto, @GetUser('id') userId: number) {
    return this.userService.editUser(userId, dto);
  }

  @Patch(':id')
  @Roles(e_Roles.Admin)
  editUser(@Body() dto: EditUserDto, @Param('id') userId: number) {
    return this.userService.editUser(userId, dto);
  }

  @Get(':userId/roles')
  @Roles(e_Roles.Admin)
  async getUserRoles(@Param('userId') userId: number) {
    return this.userRolesService.getUserRoles(userId);
  }

  @Post(':userId/roles')
  @Roles(e_Roles.Admin)
  async addRolesToUser(
    @Param('userId') userId: number,
    @Body() roles: number[],
  ) {
    await this.userRolesService.addRolesToUser(userId, roles);
  }

  @Delete(':userId/roles')
  @Roles(e_Roles.Admin)
  async removeRolesFromUser(
    @Param('userId') userId: number,
    @Body() roles: number[],
  ) {
    await this.userRolesService.removeRolesFromUser(userId, roles);
  }
}
