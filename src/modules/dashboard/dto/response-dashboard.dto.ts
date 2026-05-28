import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseDashboardDto {
  @ApiProperty({
    description: 'Total locations for current user',
    example: 10,
  })
  @Expose()
  totalLocations!: number;

  @ApiProperty({
    description: 'Total location items for current user',
    example: 150,
  })
  @Expose()
  totalLocationItems!: number;

  @ApiProperty({
    description: 'Current request count for today',
    example: 5,
  })
  @Expose()
  currentRequest!: number;
}
