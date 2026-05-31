import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { PathParameterDto } from 'src/common/dto/path-paramater.dto';
import {
  DetailSwaggerExample,
  ListSwaggerExample,
} from 'src/common/swagger/swagger-example.response';
import { FilteringLocationDto } from './dto/filtering-location.dto';
import { ResponseLocationDto } from './dto/response-location.dto';
import { LocationService } from './location.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('location')
@ApiTags('Location')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ListSwaggerExample(ResponseLocationDto, 'Mengambil Banyak Data Location')
  async findAndCount(
    @Query() queryParameterDto: FilteringLocationDto,
  ): Promise<BaseSuccessResponse<ResponseLocationDto>> {
    const { page = 1, limit = 10, isPaginate = true } = queryParameterDto;
    const [result, total] =
      await this.locationService.findAndCount(queryParameterDto);

    return {
      data: plainToInstance(ResponseLocationDto, result, {
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
    ResponseLocationDto,
    'Mengambil Data Location dengan ID',
  )
  async findOne(
    @Param() pathParamater: PathParameterDto,
  ): Promise<BaseSuccessResponse<ResponseLocationDto>> {
    const result = await this.locationService.findOneByIdOrFail(
      pathParamater.id,
    );

    return {
      data: plainToInstance(ResponseLocationDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
