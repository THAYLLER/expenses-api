import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class LimitQueryDto {
  @ApiProperty({ description: 'Limit value', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  value?: number;
}
