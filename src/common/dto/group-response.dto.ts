import { ApiProperty } from '@nestjs/swagger';

export class GroupResponseDto {
  @ApiProperty({ description: 'Field used for grouping' })
  field: string;

  @ApiProperty({ description: 'Aggregation function used' })
  function: string;

  @ApiProperty({ description: 'Array of grouped results' })
  results: Array<{
    group: string;
    value: number;
  }>;
}
