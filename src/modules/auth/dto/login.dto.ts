import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    name: 'email',
    description: 'email user',
    example: 'dimas@gmail.com',
  })
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty({
    name: 'password',
    description: 'password user',
    example: 'dimas123',
  })
  @IsString()
  password!: string;
}
