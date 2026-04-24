import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseLocationItemDto {
  @ApiProperty({ description: 'ID LocationItem', example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'createdAt LocationItem' })
  @Expose()
  createdAt!: Date;

  @Expose()
  @ApiProperty({ description: '', example: null })
  title!: string;

  @Expose()
  @ApiProperty({ description: '', example: null })
  rating!: string;

  @Expose()
  @ApiProperty({ description: '', example: null })
  address!: string;

  @Expose()
  @ApiProperty({ description: '', example: null })
  url!: string;

  @Expose()
  @ApiProperty({ description: '', example: null })
  phoneNumber!: string;

  @Expose()
  @ApiProperty({ description: '', example: null })
  googleMapsUrl!: string;
}
