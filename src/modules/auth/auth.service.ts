import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

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
}
