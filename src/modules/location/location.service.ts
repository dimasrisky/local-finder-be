import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/bases/base.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { LocationRepository } from './location.repository';

@Injectable()
export class LocationService extends BaseService<
  Location,
  CreateLocationDto,
  UpdateLocationDto
> {
  constructor(private readonly locationRepository: LocationRepository) {
    super(locationRepository);
  }
}
