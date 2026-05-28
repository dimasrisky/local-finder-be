import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseMeDto {
  @ApiProperty({
    description: 'ID User',
    example: 1,
  })
  @Expose()
  id!: number;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  @Expose()
  username!: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  @Expose()
  email!: string;

  @ApiProperty({
    description: 'Full name',
    example: 'John Doe',
    required: false,
  })
  @Expose()
  fullName!: string;

  @ApiProperty({
    description: 'Current request count for today',
    example: 5,
  })
  @Expose()
  currentRequest!: number;

  @ApiProperty({
    description: 'Account creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;
}
