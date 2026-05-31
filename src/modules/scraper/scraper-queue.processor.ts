import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ScraperService } from './scraper.service';
import { StartScrapingDto } from './dto/start-scraping.dto';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { Processor } from '@nestjs/bullmq';
import { LocationItem } from '../location-item/entities/location-item.entity';

export const SCRAPER_QUEUE_NAME = 'scraper';

export interface ScraperJobData {
  startScrapingDto: StartScrapingDto;
  user: IJwtPayload;
}

@Processor(SCRAPER_QUEUE_NAME)
export class ScraperQueueProcessor {
  private readonly logger = new Logger(ScraperQueueProcessor.name);

  constructor(private readonly scraperService: ScraperService) {}

  async process(
    job: Job<ScraperJobData, LocationItem[], string>,
  ): Promise<LocationItem[] | undefined> {
    this.logger.log(
      `Processing scraping job ${job.id} for user ${job.data.user.id}`,
    );

    if (job.name === 'start-scraping') {
      try {
        const result = await this.scraperService.startScraping(
          job.data.startScrapingDto,
          job.data.user,
        );

        this.logger.log(`Successfully processed scraping job ${job.id}`);
        return result;
      } catch (error) {
        this.logger.error(`Failed to process scraping job ${job.id}`, error);
        throw error;
      }
    }
  }
}
