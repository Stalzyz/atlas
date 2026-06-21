import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthGuard } from '../auth.guard';
import { RequirePermission } from '../permissions.decorator';
import { UserRole } from '@raaghas/database';
const bcrypt = require('bcryptjs');

@Controller('auth/users')
@UseGuards(AuthGuard)
@RequirePermission('module:roles')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async listUsers() {
    return this.prisma.user.findMany({
      where: {
        role: { not: UserRole.CUSTOMER }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        roleId: true,
        roleRef: {
          select: {
            id: true,
            name: true,
            color: true
          }
        },
        createdAt: true
      }
    });
  }

  @Post()
  async createUser(@Body() data: any) {
    const email = data.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    
    if (existing) {
      if (existing.role !== UserRole.CUSTOMER) {
         throw new UnauthorizedException('This team member already exists.');
      }
      // Upgrade customer to team member
      const updateData: any = {
        name: data.name || existing.name,
        role: data.role || UserRole.ADMIN,
        roleId: data.roleId
      };
      if (data.password) {
         updateData.password = await bcrypt.hash(data.password, 10);
      }
      return this.prisma.user.update({
         where: { email },
         data: updateData
      });
    }

    const hashedPassword = await bcrypt.hash(data.password || 'Raaghas@123', 10);
    return this.prisma.user.create({
      data: {
        email,
        name: data.name,
        password: hashedPassword,
        role: data.role || UserRole.ADMIN,
        roleId: data.roleId
      }
    });
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    const updateData: any = {
      name: data.name,
      role: data.role,
      roleId: data.roleId
    };

    if (data.email) {
      const email = data.email.toLowerCase().trim();
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== id) {
        throw new UnauthorizedException('Email is already in use by another account.');
      }
      updateData.email = email;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    // Prevent self-deletion if we had the req.user, but here we just follow the command
    return this.prisma.user.delete({ where: { id } });
  }
}
