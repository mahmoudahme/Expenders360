import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNumber, Min, Max } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'TechCorp Solutions' })
  @IsString()
  name: string;

  @ApiProperty({ example: ['United States', 'Canada'] })
  @IsArray()
  @IsString({ each: true })
  countriesSupported: string[];

  @ApiProperty({ example: ['consulting', 'development', 'design'] })
  @IsArray()
  @IsString({ each: true })
  servicesOffered: string[];

  @ApiProperty({ example: 4.5, minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 24 })
  @IsNumber()
  @Min(1)
  responseSlaHours: number;
}
