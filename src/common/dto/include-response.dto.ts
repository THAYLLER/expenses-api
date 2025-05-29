import { ApiProperty } from '@nestjs/swagger';

export class IncludeResponseDto {
  @ApiProperty({ description: 'Included relations' })
  relations: string[];
}
