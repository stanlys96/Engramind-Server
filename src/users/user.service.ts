import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from './user.dto';
import jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const { name, email, password, method } = createUserDto;

      if (!name || !email || !password) {
        throw new BadRequestException('All fields are required.');
      }

      const existing = await this.userRepository.findOne({ where: { email } });
      if (existing) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = this.userRepository.create({
        name: name,
        email: email,
        password: hashedPassword,
        method: method,
      });
      await this.userRepository.save(newUser);
      return {
        message: 'Success',
        email,
      };
    } catch (e) {}
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      if (!email || !password) {
        throw new BadRequestException('All fields are required.');
      }
      const userData = await this.userRepository.findOne({ where: { email } });
      const passwordMatch = await bcrypt.compare(password, userData?.password);
      if (!userData || !passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const accessToken = jwt.sign(
        { name: userData.name, email: userData.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' },
      );
      const refreshToken = crypto.randomUUID();
      const payload = {
        success: true,
        message: 'Login successful',
        userId: userData.id,
        name: userData.name,
        accessToken,
        refreshToken,
      };
      return payload;
    } catch {
      return { message: 'Invalid credentials' };
    }
  }
}
