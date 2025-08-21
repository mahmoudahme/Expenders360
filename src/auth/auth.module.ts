import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Client } from '../clients/entities/client.entity';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '8hEnPGeoBqGUT6zksxt4G5GW+uMdzwe7EVaRnp0xRI',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
    ClientsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}