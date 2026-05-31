import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/bases/base.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location } from './entities/location.entity';
import { LocationRepository } from './location.repository';
import { QueryParameterDto } from 'src/common/dto/query-parameter.dto';
import { FindManyOptions } from 'typeorm';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class LocationService extends BaseService<
  Location,
  CreateLocationDto,
  UpdateLocationDto
> {
  constructor(private readonly locationRepository: LocationRepository) {
    super(locationRepository);
  }

  protected paramBuilder(
    options?: QueryParameterDto,
    user?: IJwtPayload,
  ): FindManyOptions<Location> {
    const paramBuilderDefault = super.paramBuilder(options);

    paramBuilderDefault.where = {
      user: {
        id: user?.id,
      },
    };

    return paramBuilderDefault;
  }

  async findAndCountLocations(
    queryParam: QueryParameterDto,
    user?: IJwtPayload,
  ): Promise<[Location[], number]> {
    if (!user) return [[], 0];
    const options = this.paramBuilder(queryParam, user);
    return this.findAndCount(queryParam, options);
  }
}
