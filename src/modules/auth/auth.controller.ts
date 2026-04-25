import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateSwaggerExample } from 'src/common/swagger/swagger-example.response';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response-regitser.dto';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { plainToInstance } from 'class-transformer';

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
}
