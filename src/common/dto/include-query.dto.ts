import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class IncludeQueryDto {
  @ApiProperty({ description: 'Included relations', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relations?: string[];
}
