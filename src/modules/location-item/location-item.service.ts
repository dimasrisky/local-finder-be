import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/bases/base.service';
import { CreateLocationItemDto } from './dto/create-location-item.dto';
import { UpdateLocationItemDto } from './dto/update-location-item.dto';
import { LocationItem } from './entities/location-item.entity';
import { LocationItemRepository } from './location-item.repository';

@Injectable()
export class LocationItemService extends BaseService<
  LocationItem,
  CreateLocationItemDto,
  UpdateLocationItemDto
> {
  constructor(private readonly locationItemRepository: LocationItemRepository) {
    super(locationItemRepository);
  }
}
