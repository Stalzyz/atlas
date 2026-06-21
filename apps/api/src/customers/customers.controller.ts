import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('customers')
@UseGuards(AuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN', 'MARKETING', 'OPERATIONS', 'FINANCE', 'ACCOUNTANT')
export class CustomersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Query('role') role?: string) {
    const where: any = {};
    if (role && role !== 'ALL') {
      where.role = role;
    }
    
    return (this.prisma.user.findMany as any)({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        lastActiveAt: true,
        interests: true,
        createdAt: true,
        updatedAt: true,
        wallet: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('prospects')
  async findProspects() {
    return this.prisma.user.findMany({
      where: {
        role: 'CUSTOMER',
        orders: { none: {} }
      },
      select: {
        id: true,
        email: true,
        name: true,
        lastActiveAt: true,
        interests: true,
        createdAt: true,
        wallet: true,
        _count: {
          select: { reviews: true, WishlistItem: true }
        }
      },
      orderBy: { lastActiveAt: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                variant: {
                  include: { product: true }
                }
              }
            }
          }
        },
        reviews: true,
        WishlistItem: {
          include: {
            product: true
          }
        },
        wallet: true
      }
    });
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    return customer;
  }
}
