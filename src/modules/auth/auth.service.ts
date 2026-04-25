import { Injectable, Logger } from '@nestjs/common';
import { hashSync, compare } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { IsNull } from 'typeorm';
import { NotFoundException } from 'src/common/bases/exceptions/templates/not-found.exception';
import { ConfigService } from '@nestjs/config';
import { ResponseLoginDto } from './dto/response-login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const _createUser = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashSync(registerDto.password, 10),
      fullName: registerDto.fullName,
    });
    const savedUser = await this.userRepository.save(_createUser);

    return {
      username: savedUser.username,
      email: savedUser.email,
      fullName: savedUser.fullName,
    };
  }

  private async validateUser(email: string, password: string) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { email, deletedAt: IsNull() },
        select: {
          id: true,
          username: true,
          password: true,
          email: true,
          fullName: true,
        },
      });
      if (!findUser) throw new NotFoundException('Invalid Kredential', 'user');
      const isMatch = await compare(password, findUser.password);
      if (!isMatch) throw new NotFoundException('Invalid Kredential', 'user');
      return findUser;
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<ResponseLoginDto> {
    try {
      const { id, username, email, fullName } = await this.validateUser(
        loginDto.email,
        loginDto.password,
      );
      const payload = { sub: id, username, email, fullName };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      });
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      });
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }
}
