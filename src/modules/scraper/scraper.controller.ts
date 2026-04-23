import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';
import { CreateSwaggerExample } from 'src/common/swagger/swagger-example.response';
import { StartScrapingDto } from './dto/start-scraping.dto';
import { ResponseStartScraping } from './dto/response-start-scraping.dto';
import { plainToInstance } from 'class-transformer';
import { BaseSuccessResponse } from 'src/common/bases/base.response';

@Controller('scraper')
@ApiTags('Scraper')
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
  ): Promise<BaseSuccessResponse<ResponseStartScraping>> {
    const result = await this.scraperService.startScraping(startScrapingDto);
    return {
      data: plainToInstance(ResponseStartScraping, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
