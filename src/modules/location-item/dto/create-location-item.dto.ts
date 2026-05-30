import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateLocationItemDto {
  @ApiProperty({ description: '', required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: '', required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  rating: string;

  @ApiProperty({ description: '', required: false, example: '' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: '', required: false, example: '' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ description: '', required: false, example: '' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: '', required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  googleMapsUrl: string;
}
