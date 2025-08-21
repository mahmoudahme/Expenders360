import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Market Research Report - US Expansion' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Detailed analysis of US market opportunities...' })
  @IsString()
  content: string;

  @ApiProperty({ example: ['market-research', 'US', 'expansion'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: 123 })
  @IsNumber()
  projectId: number;
}

