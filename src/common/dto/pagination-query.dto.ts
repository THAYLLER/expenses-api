import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ description: 'Number of items per page', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
