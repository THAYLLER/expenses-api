import { ApiProperty } from '@nestjs/swagger';

export class LimitResponseDto {
  @ApiProperty({ description: 'Limit value' })
  value: number;
}
