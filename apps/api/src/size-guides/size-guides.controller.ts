import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { SizeGuidesService } from './size-guides.service';
import { CreateSizeGuideDto, UpdateSizeGuideDto } from './dto/size-guide.dto';

@Controller('size-guides')
export class SizeGuidesController {
  constructor(private readonly sizeGuidesService: SizeGuidesService) {}

  @Get()
  findAll() {
    return this.sizeGuidesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizeGuidesService.findOne(id);
  }

  @Post()
  create(@Body() createSizeGuideDto: CreateSizeGuideDto) {
    return this.sizeGuidesService.create(createSizeGuideDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSizeGuideDto: UpdateSizeGuideDto) {
    return this.sizeGuidesService.update(id, updateSizeGuideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizeGuidesService.remove(id);
  }
}
