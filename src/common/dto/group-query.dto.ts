import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class GroupQueryDto {
  @ApiProperty({ description: 'Group by field', required: false })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiProperty({ description: 'Group by function', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['sum', 'avg', 'min', 'max', 'count'])
  function?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}
