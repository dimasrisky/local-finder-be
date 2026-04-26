import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';
import { CreateSwaggerExample } from 'src/common/swagger/swagger-example.response';
import { StartScrapingDto } from './dto/start-scraping.dto';
import { ResponseStartScraping } from './dto/response-start-scraping.dto';
import { plainToInstance } from 'class-transformer';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express';

@Controller('scraper')
@ApiTags('Scraper')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post('start')
  @CreateSwaggerExample(
    StartScrapingDto,
    ResponseStartScraping,
    false,
    'Untuk Scraping lokasi pada google maps',
  )
  async startScraping(
    @Body() startScrapingDto: StartScrapingDto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseStartScraping>> {
    const result = await this.scraperService.startScraping(startScrapingDto);
    return {
      data: plainToInstance(ResponseStartScraping, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
