import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateSwaggerExample,
  DetailSwaggerExample,
} from 'src/common/swagger/swagger-example.response';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response-regitser.dto';
import { BaseSuccessResponse } from 'src/common/bases/base.response';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResponseMeDto } from './dto/response-me.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express';

@Controller('auth')
@ApiTags('Auth')
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

  @Post('refresh-token')
  @CreateSwaggerExample(
    RefreshTokenDto,
    ResponseLoginDto,
    false,
    'Untuk Refresh Token User',
  )
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): BaseSuccessResponse<ResponseLoginDto> {
    const result = this.authService.refreshToken(refreshTokenDto);
    return {
      data: plainToInstance(ResponseLoginDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @DetailSwaggerExample(ResponseMeDto, 'Get current user profile')
  async getMe(
    @Request() req: ExpressRequest,
  ): Promise<BaseSuccessResponse<ResponseMeDto>> {
    const result = await this.authService.getProfile(req.user!.id);
    return {
      data: plainToInstance(ResponseMeDto, result, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
