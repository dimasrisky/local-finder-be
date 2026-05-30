import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    name: 'username',
    description: 'username user',
    example: 'dimasrizky',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    name: 'email',
    description: 'email user',
    example: 'dimasrizky@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    description: 'password user',
    example: 'dimas123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    name: 'fullName',
    description: 'fullname user',
    example: 'Dimas Rizky',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;
}
