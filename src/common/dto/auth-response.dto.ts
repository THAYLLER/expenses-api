import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ description: 'Token type' })
  token_type: string;

  @ApiProperty({ description: 'Token expiration time in seconds' })
  expires_in: number;
}
