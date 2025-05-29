import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class OrderQueryDto {
  @ApiProperty({ description: 'Order by field', required: false })
  @IsOptional()
  @IsString()
  field?: string;

  @ApiProperty({ description: 'Order direction', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  direction?: 'asc' | 'desc';
}
