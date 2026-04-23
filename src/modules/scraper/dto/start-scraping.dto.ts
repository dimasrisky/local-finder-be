import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StartScrapingDto {
  @ApiProperty({
    name: 'search',
    description: 'key untuk search lokasi',
    example: 'coffeeshop',
  })
  @IsString()
  @IsNotEmpty()
  search!: string;

  @ApiProperty({
    name: 'maxScroll',
    description: 'maksimal scrolling untuk infinite pagination',
    example: 10,
    default: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  maxScroll!: number;
}
