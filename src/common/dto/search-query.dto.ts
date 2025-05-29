import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty({ description: 'Search query', required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ description: 'Search fields', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
} 