import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { StartScrapingDto } from './dto/start-scraping.dto';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { LocationItem } from '../location-item/entities/location-item.entity';
import { ScraperService } from './scraper.service';

export const SCRAPER_QUEUE_NAME = 'scraper';

export interface ScraperJobData {
  startScrapingDto: StartScrapingDto;
  user: IJwtPayload;
}

@Processor(SCRAPER_QUEUE_NAME)
@Injectable()
export class ScraperQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(ScraperQueueProcessor.name);
  private readonly scraperService: ScraperService;

  constructor(private readonly moduleRef: ModuleRef) {
    super();
    this.scraperService = this.moduleRef.get(ScraperService, { strict: false });
  }

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
