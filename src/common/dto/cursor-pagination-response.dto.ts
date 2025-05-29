import { ApiProperty } from '@nestjs/swagger';

export class CursorPaginationResponseDto<T> {
  @ApiProperty({ description: 'Array of items' })
  items: T[];

  @ApiProperty({ description: 'Next cursor' })
  nextCursor?: string;

  @ApiProperty({ description: 'Previous cursor' })
  previousCursor?: string;

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Whether there is a previous page' })
  hasPreviousPage: boolean;
}
