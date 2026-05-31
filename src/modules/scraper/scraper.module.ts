import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { ConfigModule } from 'src/config/config.module';
import { LocationItemModule } from '../location-item/location-item.module';
import { LocationModule } from '../location/location.module';
import { BullModule } from '@nestjs/bullmq';
import {
  ScraperQueueProcessor,
  SCRAPER_QUEUE_NAME,
} from './scraper-queue.processor';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: SCRAPER_QUEUE_NAME,
    }),
    LocationItemModule,
    LocationModule,
  ],
  controllers: [ScraperController],
  providers: [ScraperService, ScraperQueueProcessor],
  exports: [ScraperService],
})
export class ScraperModule {}
