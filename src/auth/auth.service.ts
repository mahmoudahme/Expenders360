import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { Client } from '../clients/entities/client.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.clientRepository.findOne({
      where: { contactEmail: email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.contactEmail,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.contactEmail,
        companyName: user.companyName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.clientRepository.findOne({
      where: { contactEmail: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const newUser = this.clientRepository.create({
      companyName: registerDto.companyName,
      contactEmail: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || 'client',
    });

    const savedUser = await this.clientRepository.save(newUser);

    const payload = {
      sub: savedUser.id,
      email: savedUser.contactEmail,
      role: savedUser.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        email: savedUser.contactEmail,
        companyName: savedUser.companyName,
        role: savedUser.role,
      },
    };
  }
}