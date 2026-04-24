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
import { CreateLocationItemDto } from './dto/create-location-item.dto';
import { FilteringLocationItemDto } from './dto/filtering-location-item.dto';
import { ResponseLocationItemDto } from './dto/response-location-item.dto';
import { UpdateLocationItemDto } from './dto/update-location-item.dto';
import { LocationItemService } from './location-item.service';

@Controller('locationItem')
@ApiTags('LocationItem')
export class LocationItemController {
  constructor(private readonly locationItemService: LocationItemService) {}

  @Post()
  @CreateSwaggerExample(
    CreateLocationItemDto,
    ResponseLocationItemDto,
    false,
    'Membuat Satu LocationItem',
  )
  async create(
    @Body() createDto: CreateLocationItemDto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseLocationItemDto>> {
    const result = await this.locationItemService.create(createDto, req.user);

    return {
      data: plainToInstance(ResponseLocationItemDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

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

  @Patch(':id')
  @DetailSwaggerExample(
    ResponseLocationItemDto,
    'Mengupdate Data LocationItem By Id',
  )
  async update(
    @Param() pathParamater: PathParameterDto,
    @Body() update: UpdateLocationItemDto,
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseLocationItemDto>> {
    const result = await this.locationItemService.update(
      pathParamater.id,
      update,
      req.user,
    );

    return {
      data: plainToInstance(ResponseLocationItemDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Delete(':id')
  @HttpCode(204)
  @DeleteSwaggerExample('Menghapus Data LocationItem dengan Id')
  async remove(
    @Param() pathParamater: PathParameterDto,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    await this.locationItemService.softRemove(pathParamater.id, req.user);
  }
}
