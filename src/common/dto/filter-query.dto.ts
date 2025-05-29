import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class FilterQueryDto {
  @ApiProperty({ description: 'Category filter', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Start date filter', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'End date filter', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
