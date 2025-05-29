import { ApiProperty } from '@nestjs/swagger';

export class AggregateResponseDto {
  @ApiProperty({ description: 'Field being aggregated' })
  field: string;

  @ApiProperty({ description: 'Aggregation function used' })
  function: string;

  @ApiProperty({ description: 'Result of the aggregation' })
  result: number;
}
