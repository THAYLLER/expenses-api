import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class SelectQueryDto {
  @ApiProperty({ description: 'Selected fields', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
}
