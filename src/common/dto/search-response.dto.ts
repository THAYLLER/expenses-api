import { ApiProperty } from '@nestjs/swagger';

export class SearchResponseDto {
  @ApiProperty({ description: 'Search query' })
  query: string;

  @ApiProperty({ description: 'Search fields' })
  fields: string[];
}
