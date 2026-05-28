import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DetailSwaggerExample } from 'src/common/swagger/swagger-example.response';
import { ResponseDashboardDto } from './dto/response-dashboard.dto';
import { plainToInstance } from 'class-transformer';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @DetailSwaggerExample(
    ResponseDashboardDto,
    'Get dashboard statistics for current user',
  )
  async getDashboardStats(
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseDashboardDto>> {
    const result = await this.dashboardService.getDashboardData(req.user!.id);
    return {
      data: plainToInstance(ResponseDashboardDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
