import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationItem } from './entities/location-item.entity';
import { LocationItemController } from './location-item.controller';
import { LocationItemRepository } from './location-item.repository';
import { LocationItemService } from './location-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationItem])],
  controllers: [LocationItemController],
  providers: [LocationItemService, LocationItemRepository],
  exports: [LocationItemService, LocationItemRepository],
})
export class LocationItemModule {}
