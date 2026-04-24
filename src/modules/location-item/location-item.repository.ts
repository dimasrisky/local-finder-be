import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/bases/base.repository';
import { DataSource } from 'typeorm';
import { LocationItem } from './entities/location-item.entity';

@Injectable()
export class LocationItemRepository extends BaseRepository<LocationItem> {
  constructor(private readonly dataSource: DataSource) {
    super(LocationItem, dataSource);
  }
}
