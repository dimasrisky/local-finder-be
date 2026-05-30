import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '', required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '', required: false, example: '' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: '', required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: '', required: true, example: '' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ description: '', required: true, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  currentRequest: number;
}
