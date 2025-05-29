import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ description: 'ID of the user' })
  id: string;

  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({ description: 'Creation date of the user' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the user' })
  updatedAt: Date;
}
