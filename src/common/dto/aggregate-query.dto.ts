import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class AggregateQueryDto {
  @ApiProperty({ description: 'Aggregation field', required: false })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiProperty({ description: 'Aggregation function', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['sum', 'avg', 'min', 'max', 'count'])
  function?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}
