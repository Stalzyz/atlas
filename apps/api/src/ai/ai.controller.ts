import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';
import { Public } from '../auth/public.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Public()
  @Post('search')
  async search(@Body('query') query: string) {
    if (!query) {
      throw new BadRequestException('Query is required');
    }
    return this.aiService.search(query);
  }
}
