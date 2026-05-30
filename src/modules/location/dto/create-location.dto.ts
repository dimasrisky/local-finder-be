import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ description: '', required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '', required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  searchQuery: string;

  @ApiProperty({ description: '', required: true, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  totalItems: number;
}
