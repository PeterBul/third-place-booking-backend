import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator';
import { e_Roles } from 'src/auth/enum/role.enum';
import { AccessTokenGuard, RolesGuard } from 'src/auth/guard';
import { RoleService } from './role.service';

@Controller('roles')
@UseGuards(AccessTokenGuard, RolesGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @Roles(e_Roles.Admin)
  async getRoles() {
    return this.roleService.getAllRoles();
  }
}
