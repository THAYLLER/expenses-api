import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CursorPaginationQueryDto {
  @ApiProperty({ description: 'Cursor for pagination', required: false })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiProperty({ description: 'Number of items per page', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
