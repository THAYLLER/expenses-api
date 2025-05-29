import { ApiProperty } from '@nestjs/swagger';

export class ExcludeResponseDto {
  @ApiProperty({ description: 'Excluded fields' })
  fields: string[];
}
