import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDocumentsDto {
  @ApiProperty({ required: false, example: 'market research' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ required: false, example: ['market-research', 'expansion'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false, example: 123 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  projectId?: number;
}