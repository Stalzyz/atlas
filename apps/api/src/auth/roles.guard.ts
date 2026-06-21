import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@raaghas/database';
import { ROLES_KEY } from './roles.decorator';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('User context missing');

    const userId = user.id || user.sub;

    // Fetch full user with Role and Permissions
    const dbUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleRef: {
          include: { permissions: true }
        }
      }
    });

    if (!dbUser) throw new ForbiddenException('User not found in database');

    // 1. Check Legacy Roles
    if (requiredRoles) {
      const hasLegacyRole = requiredRoles.includes(dbUser.role);
      if (hasLegacyRole) return true;
    }

    // 2. Check Granular Permissions
    if (requiredPermissions) {
      // If user is SUPER_ADMIN or ADMIN, they have all permissions
      if (dbUser.role === UserRole.SUPER_ADMIN || dbUser.role === UserRole.ADMIN) return true;

      const userPermissions = dbUser.roleRef?.permissions.map(p => p.action) || [];
      const hasPermission = requiredPermissions.every(perm => userPermissions.includes(perm));
      
      if (hasPermission) return true;
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
