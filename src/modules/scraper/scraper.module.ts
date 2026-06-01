import { Module } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { LocationItemModule } from '../location-item/location-item.module';
import { LocationModule } from '../location/location.module';
import { BullModule } from '@nestjs/bullmq';
import {
  ScraperQueueProcessor,
  SCRAPER_QUEUE_NAME,
} from './scraper-queue.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SCRAPER_QUEUE_NAME,
    }),
    LocationItemModule,
    LocationModule,
  ],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    {
      provide: ScraperQueueProcessor,
      useFactory: (moduleRef) => new ScraperQueueProcessor(moduleRef),
      inject: [ModuleRef],
    },
  ],
  exports: [ScraperService],
})
export class ScraperModule {}
