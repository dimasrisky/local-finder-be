import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/bases/base.repository';
import { DataSource } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationRepository extends BaseRepository<Location> {
  constructor(private readonly dataSource: DataSource) {
    super(Location, dataSource);
  }
}
