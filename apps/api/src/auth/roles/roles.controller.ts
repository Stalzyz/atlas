import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthGuard } from '../auth.guard';
import { Public } from '../public.decorator';
import { RequirePermission } from '../permissions.decorator';

@Controller('auth/roles')
@UseGuards(AuthGuard)
@RequirePermission('module:roles')
export class RolesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async listRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: true,
        _count: { select: { users: true } }
      }
    });
  }

  private readonly logger = new Logger('RolesController');

  @Post()
  async createRole(@Body() data: any) {
    this.logger.log(`Creating role: ${data.name} with ${data.permissions?.length || 0} permissions`);
    try {
      const result = await this.prisma.role.create({
        data: {
          name: data.name,
          description: data.description,
          color: data.color || 'bg-wine/5 text-wine',
          permissions: {
            connectOrCreate: (data.permissions || []).map((p: string) => ({
              where: { action: p },
              create: { action: p }
            }))
          }
        },
        include: { permissions: true }
      });
      this.logger.log(`Role created successfully: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create role: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Put(':id')
  async updateRole(@Param('id') id: string, @Body() data: any) {
    this.logger.log(`Updating role ${id}: ${data.name}`);
    try {
      const result = await this.prisma.role.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          color: data.color || 'bg-wine/5 text-wine',
          permissions: {
            set: [], // Clear existing relations
            connectOrCreate: (data.permissions || []).map((p: string) => ({
              where: { action: p },
              create: { action: p }
            }))
          }
        },
        include: { permissions: true }
      });
      this.logger.log(`Role ${id} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update role ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    return this.prisma.role.delete({ where: { id } });
  }

  @Get('permissions')
  async listPermissions() {
    return this.prisma.permission.findMany();
  }
}
