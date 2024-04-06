import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) {}

  async getAllRoles() {
    return await this.prismaService.role.findMany();
  }
}
