import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class SortQueryDto {
  @ApiProperty({ description: 'Field to sort by', required: false })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiProperty({ description: 'Sort direction (asc or desc)', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  direction?: 'asc' | 'desc';
}
