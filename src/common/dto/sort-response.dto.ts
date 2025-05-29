import { ApiProperty } from '@nestjs/swagger';

export class SortResponseDto {
  @ApiProperty({ description: 'Field to sort by' })
  field: string;

  @ApiProperty({ description: 'Sort direction (asc or desc)' })
  direction: 'asc' | 'desc';
}
