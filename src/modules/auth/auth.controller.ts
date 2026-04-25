import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateSwaggerExample } from 'src/common/swagger/swagger-example.response';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response-regitser.dto';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @CreateSwaggerExample(
    RegisterDto,
    ResponseRegisterDto,
    false,
    'Untuk Register User',
  )
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<BaseSuccessResponse<ResponseRegisterDto>> {
    const result = await this.authService.register(registerDto);
    return {
      data: plainToInstance(ResponseRegisterDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Post('login')
  @CreateSwaggerExample(LoginDto, ResponseLoginDto, false, 'Untuk Login User')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<BaseSuccessResponse<ResponseLoginDto>> {
    const result = await this.authService.login(loginDto);
    return {
      data: plainToInstance(ResponseLoginDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
