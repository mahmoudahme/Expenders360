import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'client', enum: ['client', 'admin'], required: false })
  @IsOptional()
  @IsEnum(['client', 'admin'])
  role?: string;
}
