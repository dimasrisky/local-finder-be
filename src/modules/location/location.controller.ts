import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Request as ExpressRequest } from 'express';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { PathParameterDto } from 'src/common/dto/path-paramater.dto';
import {
  CreateSwaggerExample,
  DeleteSwaggerExample,
  DetailSwaggerExample,
  ListSwaggerExample,
} from 'src/common/swagger/swagger-example.response';
import { CreateLocationDto } from './dto/create-location.dto';
import { FilteringLocationDto } from './dto/filtering-location.dto';
import { ResponseLocationDto } from './dto/response-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationService } from './location.service';

@Controller('location')
@ApiTags('Location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  @CreateSwaggerExample(
    CreateLocationDto,
    ResponseLocationDto,
    false,
    'Membuat Satu Location',
  )
  async create(
    @Body() createDto: CreateLocationDto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseLocationDto>> {
    const result = await this.locationService.create(createDto, req.user);

    return {
      data: plainToInstance(ResponseLocationDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

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

  @Patch(':id')
  @DetailSwaggerExample(ResponseLocationDto, 'Mengupdate Data Location By Id')
  async update(
    @Param() pathParamater: PathParameterDto,
    @Body() update: UpdateLocationDto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseLocationDto>> {
    const result = await this.locationService.update(
      pathParamater.id,
      update,
      req.user,
    );

    return {
      data: plainToInstance(ResponseLocationDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Delete(':id')
  @HttpCode(204)
  @DeleteSwaggerExample('Menghapus Data Location dengan Id')
  async remove(
    @Param() pathParamater: PathParameterDto,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    await this.locationService.softRemove(pathParamater.id, req.user);
  }
}
