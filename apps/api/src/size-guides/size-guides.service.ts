import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSizeGuideDto, UpdateSizeGuideDto } from './dto/size-guide.dto';

@Injectable()
export class SizeGuidesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sizeGuide.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const guide = await this.prisma.sizeGuide.findUnique({ where: { id } });
    if (!guide) throw new NotFoundException('Size guide not found');
    return guide;
  }

  async create(data: CreateSizeGuideDto) {
    const existing = await this.prisma.sizeGuide.findUnique({ where: { name: data.name } });
    if (existing) throw new ConflictException('Size guide with this name already exists');
    return this.prisma.sizeGuide.create({ data });
  }

  async update(id: string, data: UpdateSizeGuideDto) {
    await this.findOne(id); // ensure exists
    if (data.name) {
      const existing = await this.prisma.sizeGuide.findUnique({ where: { name: data.name } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Size guide with this name already exists');
      }
    }
    return this.prisma.sizeGuide.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    await this.findOne(id); // ensure exists
    return this.prisma.sizeGuide.delete({ where: { id } });
  }
}
