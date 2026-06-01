import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseLocationDto {
  @ApiProperty({ description: 'ID Location', example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ description: 'createdAt Location' })
  @Expose()
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: '', example: null })
  name: string;

  @Expose()
  @ApiProperty({ description: '', example: null })
  searchQuery: string;

  @Expose()
  @ApiProperty({ description: '', example: null })
  totalItems: number;

  @Expose()
  @ApiProperty({ description: 'Status scraping', example: 'PROCESSING' })
  status: string;
}
