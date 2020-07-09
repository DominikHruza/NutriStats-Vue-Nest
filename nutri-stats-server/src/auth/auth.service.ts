import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { authCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: authCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentials);
  }

  async signIn(
    authCredentials: authCredentialsDto,
  ): Promise<{ userId: number; username: string; token: string }> {
    const userData = await this.userRepository.validateUserPassword(
      authCredentials,
    );
    console.log(userData);
    if (!userData) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { username, userId } = userData;

    const payload: JwtPayload = { username };
    const token = await this.jwtService.sign(payload);

    return { userId, username, token };
  }
}