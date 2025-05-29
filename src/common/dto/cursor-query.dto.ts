import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CursorQueryDto {
  @ApiProperty({ description: 'Cursor value', required: false })
  @IsOptional()
  @IsString()
  value?: string;
}
