import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class StartScrapingDto {
  @ApiProperty({
    name: 'name',
    description: 'nama scraping',
    example: 'Data coffeeshop',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'search',
    description: 'key untuk search lokasi',
    example: 'coffeeshop',
  })
  @IsString()
  @IsNotEmpty()
  search: string;

  @ApiProperty({
    name: 'maxScroll',
    description: 'maksimal scrolling untuk infinite pagination',
    example: 10,
    default: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  maxScroll: number;

  @ApiProperty({
    name: 'latitude',
    description: 'latitude lokasi client untuk pencarian lokal',
    example: -7.9679881,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    name: 'longitude',
    description: 'longitude lokasi client untuk pencarian lokal',
    example: 112.6383366,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    name: 'zoom',
    description: 'zoom level untuk google maps (1-20)',
    example: 15,
    default: 15,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  zoom?: number;
}
