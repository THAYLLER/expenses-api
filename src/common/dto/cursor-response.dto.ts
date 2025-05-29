import { ApiProperty } from '@nestjs/swagger';

export class CursorResponseDto<T> {
  @ApiProperty({ description: 'Array of items' })
  items: T[];

  @ApiProperty({ description: 'Cursor for the next page' })
  nextCursor: string | null;

  @ApiProperty({ description: 'Whether there are more items to fetch' })
  hasMore: boolean;
}
