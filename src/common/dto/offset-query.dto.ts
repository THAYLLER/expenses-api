import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class OffsetQueryDto {
  @ApiProperty({ description: 'Offset value', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;
}
