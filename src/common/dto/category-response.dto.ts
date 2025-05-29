import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category ID' })
  id: string;

  @ApiProperty({ description: 'Category name' })
  name: string;

  @ApiProperty({ description: 'Category description' })
  description: string;

  @ApiProperty({ description: 'Category color' })
  color: string;

  @ApiProperty({ description: 'Category icon' })
  icon: string;

  @ApiProperty({ description: 'User ID who created the category' })
  userId: string;

  @ApiProperty({ description: 'Category creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Category last update date' })
  updatedAt: Date;
}
