import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseStartScraping {
  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  rating: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  googleMapsUrl: string;
}
