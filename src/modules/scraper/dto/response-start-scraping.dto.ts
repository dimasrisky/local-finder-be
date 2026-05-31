import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class ResponseStartScraping {
  @ApiProperty({ description: 'ID Job' })
  @IsString()
  @Expose()
  jobId: string;

  @ApiProperty({ description: 'Status' })
  @IsString()
  @Expose()
  status: string;
}
