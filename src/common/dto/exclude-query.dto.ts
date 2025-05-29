import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class ExcludeQueryDto {
  @ApiProperty({ description: 'Excluded fields', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
}
