import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ description: 'Field used for ordering' })
  field: string;

  @ApiProperty({ description: 'Order direction (asc or desc)' })
  direction: 'asc' | 'desc';
}
