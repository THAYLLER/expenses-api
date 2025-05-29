import { ApiProperty } from '@nestjs/swagger';

export class ValidationResponseDto {
  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Validation error message' })
  message: string;

  @ApiProperty({ description: 'Validation error details' })
  errors: Array<{
    field: string;
    message: string;
  }>;
}
