import { Module } from '@nestjs/common';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [ScraperController],
  providers: [ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}
