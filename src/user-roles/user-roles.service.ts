import { Injectable, NotFoundException } from '@nestjs/common';
import { e_Roles } from 'src/auth/enum/role.enum';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRolesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserRoles(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.roles;
  }

  async addRolesToUser(userId: number, roles: e_Roles[]) {
    // Fetch user from the database
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user entity in the database
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          connect: roles.map((role) => ({ id: role })),
        },
      },
    });
  }

  async removeRolesFromUser(userId: number, roles: e_Roles[]) {
    // Fetch user from the database
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          disconnect: roles.map((role) => ({ id: role })),
        },
      },
    });
  }
}
