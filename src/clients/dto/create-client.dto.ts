import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export enum Role {
  CLIENT = 'client',
  ADMIN = 'admin',
}

export class CreateClientDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'contact@gmail.com' })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ example: 'client', enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
