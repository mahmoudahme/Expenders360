import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'United States' })
  @IsString()
  country: string;

  @ApiProperty({ example: ['consulting', 'development'] })
  @IsArray()
  @IsString({ each: true })
  servicesNeeded: string[];

  @ApiProperty({ example: 50000.00 })
  @IsNumber()
  budget: number;

  @ApiProperty({ example: 'active', enum: ['active', 'paused', 'completed'] })
  @IsOptional()
  @IsEnum(['active', 'paused', 'completed'])
  status?: string;
}