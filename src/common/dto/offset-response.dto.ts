import { ApiProperty } from '@nestjs/swagger';

export class OffsetResponseDto {
  @ApiProperty({ description: 'Offset value' })
  value: number;
}
