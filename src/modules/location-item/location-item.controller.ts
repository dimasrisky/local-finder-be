import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { PathParameterDto } from 'src/common/dto/path-paramater.dto';
import {
  DetailSwaggerExample,
  ListSwaggerExample,
} from 'src/common/swagger/swagger-example.response';
import { FilteringLocationItemDto } from './dto/filtering-location-item.dto';
import { ResponseLocationItemDto } from './dto/response-location-item.dto';
import { LocationItemService } from './location-item.service';

@Controller('locationItem')
@ApiTags('LocationItem')
export class LocationItemController {
  constructor(private readonly locationItemService: LocationItemService) {}

  @Get()
  @ListSwaggerExample(
    ResponseLocationItemDto,
    'Mengambil Banyak Data LocationItem',
  )
  async findAndCount(
    @Query() queryParameterDto: FilteringLocationItemDto,
  ): Promise<BaseSuccessResponse<ResponseLocationItemDto>> {
    const { page = 1, limit = 10, isPaginate = true } = queryParameterDto;
    const [result, total] =
      await this.locationItemService.findAndCount(queryParameterDto);

    return {
      data: plainToInstance(ResponseLocationItemDto, result, {
        excludeExtraneousValues: true,
      }),
      meta: {
        page: isPaginate ? page : 1,
        totalPage: isPaginate ? Math.ceil(total / limit) : 1,
        totalData: total,
      },
    };
  }

  @Get(':id')
  @DetailSwaggerExample(
    ResponseLocationItemDto,
    'Mengambil Data LocationItem dengan ID',
  )
  async findOne(
    @Param() pathParamater: PathParameterDto,
  ): Promise<BaseSuccessResponse<ResponseLocationItemDto>> {
    const result = await this.locationItemService.findOneByIdOrFail(
      pathParamater.id,
    );

    return {
      data: plainToInstance(ResponseLocationItemDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
