import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T> {
  @ApiProperty({ description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ description: 'Success message' })
  message: string;

  @ApiProperty({ description: 'Response data' })
  data: T;
}
