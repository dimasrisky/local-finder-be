import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { ConfigModule } from 'src/config/config.module';
import { LocationItemModule } from '../location-item/location-item.module';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [ConfigModule, LocationItemModule, LocationModule],
  controllers: [ScraperController],
  providers: [ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
