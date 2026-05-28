import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../location/entities/location.entity';
import { LocationItem } from '../location-item/entities/location-item.entity';
import { User } from '../user/entities/user.entity';
import { ResponseDashboardDto } from './dto/response-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(LocationItem)
    private readonly locationItemRepository: Repository<LocationItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getDashboardData(userId: number): Promise<ResponseDashboardDto> {
    const totalLocations: number = await this.locationRepository.count({
      where: { user: { id: userId } },
    });

    const totalLocationItems: number = await this.locationItemRepository.count({
      where: {
        location: {
          user: {
            id: userId,
          },
        },
      },
    });

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { currentRequest: true },
    });

    return {
      totalLocations,
      totalLocationItems,
      currentRequest: user?.currentRequest || 0,
    };
  }
}
